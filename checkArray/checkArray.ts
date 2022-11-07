
export function checkArray(array: number[]) {
    let result = 1;
    for (let item of array){
        if( item === 0){
            result = 0;
            return result;
        }
        result *= Math.sign(item);
    }
    return result;
}

const arr = [  1, 3, 4, -1, -3, -12, -5, -9];

console.log(checkArray(arr));