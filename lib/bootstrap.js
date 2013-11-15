window.addEventListener(
    'DOMContentLoaded',
    function(e) {
        var scripts = document.getElementsByTagName('script');
        var allBs = [];
        for (var i = 0, scr; scr = scripts[i++];) {
            if (scr.type !== 'application/bs') continue;
            allBs.push([scr.src, scr.innerHTML]);
        }
        function exec(script) {
            eval(bs.stringify(bs.parse(script)));
        }
        function run() {
            if (!allBs.length) return;
            var data = allBs.shift();
            if (!data[0]) {
                return exec(data[1]), run();
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', data[0], true);
            xhr.addEventListener('load', function() {
                return exec(xhr.responseText), run();
            }, false);
            xhr.addEventListener('error', run, false);
            xhr.send(null);
        }
        run();
    },
    false
);

