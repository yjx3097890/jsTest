enum Color {Red = 1, Green, Blue};
let colorName: Color = Color.Blue;

function f(obj: {a?:string, b: number} = {a: "", b: 0}): void {
    // ...
     
}

let {a, b} = {a: "baz", b: 101};

({a, b} = {a: "baz", b: 101})

interface SquareConfig {
  color?: string;
  width?: number;
} 
