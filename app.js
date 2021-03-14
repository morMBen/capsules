class Person {
    constructor(id, name, lastname, capsule, age, city, gender, hobby) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.capsule = capsule;
        this.age = age;
        this.city = city;
        this.gender = gender;
        this.hobby = hobby;
        this.wether;
    }
}
class Capsule {
    constructor() {
        this.list = [];
        this.tempList = [];
        this.listBox = document.querySelector('.listBox');
        this.selectOpE = document.querySelector('.selectOp');
        this.search = document.querySelector('.search');
        this.selectorsOpE = ['Name', 'Last Name', 'Capsule', 'age', 'City', 'Gender', 'Hobby'];
        this.sortType = '';
        this.editOpen = false;
        this.searchValue = '';
    }
    setTopBarInHtml() {
        this.options = this.selectorsOpE.reduce((acc, cur) => acc + `<option value="${cur.toLowerCase().split(' ').join('')}">${cur}</option>`, '');
        this.options = `<option value="everything">Everything</option>` + this.options;
        this.selectOpE.innerHTML = this.options;
        this.selectorsOpE.unshift('Id');
    }
    setSortListInHtml() {
        this.topSortList = document.createElement('div');
        this.topSortList.classList.add('topList');
        this.topSortList.innerHTML = this.selectorsOpE.reduce((acc, cur) => {
            return acc + `
            <div data-sort="${cur.toLowerCase().split(' ').join('')}"><h4>${cur}</h3></div>`
        }, '');
        this.listBox.appendChild(this.topSortList);
    }
    async fetchAllPersons() {
        const loader = document.querySelector('.loading-wrap');
        const response = await fetch('https://apple-seeds.herokuapp.com/api/users/');
        const data = await response.json();
        await Promise.all(data.map(async (e, i) => {
            let response2 = await fetch(`https://apple-seeds.herokuapp.com/api/users/${data[i].id}`);
            let data2 = await response2.json();
            let temp = new Person(data[i].id, data[i].firstName, data[i].lastName, data[i].capsule, data2.age, data2.city, data2.gender, data2.hobby);
            this.list.push(temp);
        }));
        loader.style.visibility = 'hidden';
    }

    setAllPersonsInHtml(arr) {
        arr.forEach(e => {
            this.personList = document.createElement('li');
            this.personList.classList.add(`${e.id}`);
            this.personList.innerHTML = `<div data-person="id"><p>${e.id}</p></div><div data-person="name"><p>${e.name}</p></div><div data-person="lastname"><p>${e.lastname}</p></div><div data-person="capsule"><p>${e.capsule}</p></div><div data-person="age"><p>${e.age}</p></div><div data-person="city"><p>${e.city}</p></div><div data-person="gender"><p>${e.gender}</p></div><div data-person="hobby"><p>${e.hobby}</p></div><div data-person="edit"><button class="edit">Edit</button></div><div data-person="delete"><button class="delete">Delete</button></div>`;
            this.listBox.appendChild(this.personList);
        })
    }
    getSortedListBy(sortName) {
        if (sortName) {
            let temp = this.list.sort((a, b) => (this.sortType === '' || this.sortType !== sortName ? a : b)[sortName].toString().localeCompare((this.sortType === '' || this.sortType !== sortName ? b : a)[sortName].toString(), 'undefine', { numeric: true }));
            this.sortType = sortName === this.sortType ? '' : sortName;
            return temp;
        }
    }
    sortEvent() {
        this.topSortList.addEventListener('click', e => {
            this.getSortedListBy(e.target.parentElement.dataset.sort);
            this.resetPage();
        })
    }
    deletePersonFromList(id) {
        const index = this.list.findIndex(e => e.id.toString() === id.toString());
        this.list.splice(index, 1);
    }
    deleteItemEvent() {
        const deleteLi = document.querySelectorAll('.delete');
        deleteLi.forEach(e => {
            e.addEventListener('click', (e) => {
                this.deletePersonFromList(e.target.parentElement.parentElement.classList[0]);
                this.resetPage();
            })
        })
    }
    getInedxInTempListById(id) {
        return this.tempList.findIndex(e => e.id === id);
    }
    editEvent() {
        const edit = document.querySelectorAll('.edit');
        edit.forEach(e => {
            e.addEventListener('click', (e) => {
                this.tempList = JSON.parse(JSON.stringify(this.list));
                let el = e.target.parentElement.parentElement.firstChild;
                for (let i = 0; i < 10; i++) {
                    if (i < 1) { }
                    else if (i < 8) {
                        el.innerHTML = `<input data-input="${el.dataset.person}" class="edit_person" type="text" placeholder="${el.firstChild.textContent} "> `;
                        el.firstChild.addEventListener('keyup', (ele) => {
                            const thePersonId = Number(ele.target.parentElement.parentElement.classList[0]);
                            const elementInTempList = this.tempList[this.getInedxInTempListById(thePersonId)];
                            elementInTempList[ele.target.dataset.input] = ele.target.value;
                        })
                    } else if (i < 9) {
                        el.innerHTML = '<button class="cansel">Cansel</button>';
                        el.firstChild.addEventListener('click', () => {
                            this.editOpen = this.editOpen === true ? false : true;
                            this.resetPage();
                        })
                    } else {
                        el.innerHTML = '<button class="confirm">Confirm</button>';
                        el.firstChild.addEventListener('click', () => {
                            this.editOpen = this.editOpen === true ? false : true;
                            this.list = JSON.parse(JSON.stringify(this.tempList));
                            this.resetPage(this.tempList);
                        })
                    }
                    el = el.nextElementSibling
                }
                if (this.editOpen) {
                    this.resetPage();
                }
                this.editOpen = this.editOpen === true ? false : true;
            })
        })
    }
    searchEvent(type = 'everything') {
        let personList = this.listBox.firstChild;
        for (let i = 0; i < this.list.length; i++) {
            personList = personList.nextElementSibling;
            personList.style.display = 'none';
            const reg = new RegExp(`^${this.searchValue}`, 'i');
            if (type === 'everything') {
                for (const prop in this.list[i]) {
                    if (reg.test(this.list[i][prop])) {
                        personList.style.display = 'grid'
                    }
                }
            } else {
                if (this.list[i][type].toString().toLowerCase().includes(this.searchValue.toString().toLowerCase())) {
                    personList.style.display = 'grid'
                }
            }
        }
    }
    searchInit() {
        this.searchEvent(this.selectOpE.value);
        this.search.addEventListener('keyup', (e) => {
            this.searchValue = e.target.value;
            this.searchEvent(this.selectOpE.value);
        })
    }
    resetPage(whichList = this.list) {
        this.clearHtmlList();
        this.setSortListInHtml();
        this.setAllPersonsInHtml(whichList);
        this.deleteItemEvent();
        this.sortEvent();
        this.editEvent();
        this.searchInit();
    }
    clearHtmlList() {
        this.listBox.innerHTML = '';
    }
    getList() {
        return this.list;
    }
    restartPage() {
        const restart = document.querySelector(".restartPage");
        restart.addEventListener('click', () => {
            this.list = JSON.parse(localStorage.getItem('myCapsule'));
            this.resetPage();
        })
    }
}
async function starter() {
    let c1 = new Capsule()
    c1.setTopBarInHtml();
    c1.setSortListInHtml()
    await c1.fetchAllPersons();
    localStorage.setItem('myCapsule', JSON.stringify(c1.list));
    c1.setAllPersonsInHtml(c1.list);
    c1.restartPage();
    c1.deleteItemEvent();
    c1.sortEvent();
    c1.editEvent();
    c1.searchInit();
}
starter()



