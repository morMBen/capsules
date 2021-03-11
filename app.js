class Person {
    constructor(id, name, lastName, capsule, age, city, gender, hobby) {
        this.id = id;
        this.name = name;
        this.lastname = lastName;
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
        this.listBox = document.querySelector('.listBox');
        this.selectOpE = document.querySelector('.selectOp');
        this.selectorsOpE = ['Name', 'Last Name', 'Capsule', 'age', 'City', 'Gender', 'Hobby'];
    }
    setTopBarInHtml() {
        this.options = this.selectorsOpE.reduce((acc, cur) => acc + `<option value="${cur.toLowerCase().split(' ').join('')}">${cur}</option>`, '');
        this.selectOpE.innerHTML = this.options;
        this.selectorsOpE.unshift('Id');
    }
    setSortListInHtml() {
        this.topSortList = document.createElement('li');
        this.topSortList.innerHTML = this.selectorsOpE.reduce((acc, cur) => {
            return acc + `
        <div data-sort="${cur.toLowerCase().split(' ').join('')}"><h4>${cur}</h3></div>`
        }, '');
        this.listBox.appendChild(this.topSortList);
    }
    async fetchAllPersons() {
        // const files = await getFilePaths();

        // await Promise.all(files.map(async (file) => {
        //     const contents = await fs.readFile(file, 'utf8')
        //     console.log(contents)
        // }));


        const response = await fetch('https://apple-seeds.herokuapp.com/api/users/');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            let response2 = await fetch(`https://apple-seeds.herokuapp.com/api/users/${data[i].id}`);
            let data2 = await response2.json();
            let temp = new Person(data[i].id, data[i].firstName, data[i].lastname, data[i].capsule, data2.age, data2.city, data2.gender, data2.hobby);
            //     let response3 = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${data2.city}&appid=859adcc48d4c7905b04ecd5730f626be`);
            //     let data3 = await response3.json();
            //     temp.setWether(data3)
            this.list.push(temp);
        }
    }
    setAllPersonsInHtml(arr) {
        arr.forEach(e => {
            this.personList = document.createElement('li');
            this.personList.classList.add(`${e.id}`);
            this.personList.innerHTML = `<div><p>${e.id}</p></div><div><p>${e.name}</p></div><div><p>${e.lastname}</p></div><div><p>${e.capsule}</p></div><div><p>${e.age}</p></div><div><p>${e.city}</p></div><div><p>${e.gender}</p></div><div><p>${e.hobby}</p></div><div><button>Edit</button></div><div><button class="delete">Delete</button></div>`;
            this.listBox.appendChild(this.personList);
        })
    }
    getSortedListBy(sortName) {
        return this.list.sort((a, b) => a[sortName].toString().localeCompare(b[sortName].toString(), 'undefine', { numeric: true }))
    }
    sortEvent() {
        // console.log(this.topSortList)
        this.topSortList.addEventListener('click', e => {
            console.log(e.target.parentElement.dataset.sort);
        })
    }
    deletePersonFromList(id) {
        const index = this.list.indexOf(this.list[id]);
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
    resetPage() {
        this.clearHtmlList();
        this.setSortListInHtml();
        this.setAllPersonsInHtml(this.list);
        this.deleteItemEvent();
    }
    clearHtmlList() {
        this.listBox.innerHTML = '';
    }
    getList() {
        return this.list;
    }

}
async function starter() {
    let c1 = new Capsule()
    c1.setTopBarInHtml();
    c1.setSortListInHtml()
    await c1.fetchAllPersons();
    c1.setAllPersonsInHtml(c1.getList());
    c1.deleteItemEvent();
    c1.sortEvent();
    console.log(c1.getList());
}
starter()
