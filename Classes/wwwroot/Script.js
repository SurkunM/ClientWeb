document.addEventListener("DOMContentLoaded", function () {
    (function () {
        function Animal(name) {
            this.name = name;
        }

        Animal.prototype.talk = function () {
            console.log("Издает звук");
        };

        function Cat(name) {
            this.talk = function () {
                console.log("Мяу");
            }
        };

        function Dog(name) {
            this.talk = function () {
                console.log("Гаф");
            }
        };

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
                console.log("мяу");
            }
        }

        class Dog extends Animal {
            talk() {
                console.log("гаф");
            }
        }

        const kitty = new Cat("Kate");
        const puppy = new Dog("Sharik");

        kitty.talk();
        puppy.talk();
    })();
});