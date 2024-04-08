export default class Tile{
    #tileElement
    #x
    #y
    #value
    constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4){
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile");
        tileContainer.append(this.#tileElement);
        this.value = value;
    }
    get value(){
        return this.#value;
    }

    set value(v){
        this.#value = v;
        this.#tileElement.textContent = v;
        const bck = Math.log2(v);
        const bgLight = 100 - bck*7;
        const clr = 30+(v*18);
        this.#tileElement.style.setProperty("--backgroud-lightness",`${bgLight}%`)
        this.#tileElement.style.setProperty("--color",clr)
        this.#tileElement.style.setProperty("--text-lightness",`${bgLight <=50 ? 80 : 20}%`)
    }
    set x(value){
        this.#x = value;
        // below code providing the value of x for thie.#tileElement from constructor class i.e document.createElement("div") it is the tile we want to create
        this.#tileElement.style.setProperty("--x",value);
    }
    set y(value){
        this.#y = value;
        // below code providing the value of x for thie.#tileElement from constructor class i.e document.createElement("div") it is the tile we want to create
        this.#tileElement.style.setProperty("--y",value);
    }

    removeMergeTile(){
        this.#tileElement.remove();
    }
    waitForTransition(animation = false){
        return new Promise(resolve =>{
            this.#tileElement.addEventListener(
                animation ? "animationend" :"transitionend",resolve,{
                once : true,
            })
        })
    }
}