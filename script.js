var input = document.querySelector('#input');
var output = document.querySelector('#output');

function run() {
    output.value = bs.stringify(bs.parse(input.value));
}
run();
document.querySelector('#try button').onclick = run;
