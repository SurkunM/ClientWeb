(function () {
    function Animal(name) {
        this.name = name;

        Animal.prototype.talk = function () {
            console.log("Издает звук");
        }
    }

    function Cat(name) {
        this.talk = function () {
            console.log("Мяукает");
        }
    }

    function Dog(name) {
        this.talk = function () {
            console.log("Лает");
        }
    }

    Object.setPrototypeOf(Cat.prototype, Animal.prototype);
    Object.setPrototypeOf(Dog.prototype, Animal.prototype);

    const kitty = new Cat("Kate");
    const puppy = new Dog("Sharik");    

    kitty.talk();
    puppy.talk();    
})();

(function () {
    class Animal {
        constructor(name) {
            this.name = name;
        }

        talk() {
            console.log("Издает звук");
        }
    }

    class Cat extends Animal {
        talk() {
            console.log("Мяукает");
        }
    }

    class Dog extends Animal {
        talk() {
            console.log("Лает");
        }
    }

    const kitty = new Cat("Kate");
    const puppy = new Dog("Sharik");

    kitty.talk();
    puppy.talk();
})();