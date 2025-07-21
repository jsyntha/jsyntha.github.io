console.log("main.js loaded");

document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        e.preventDefault();

        let shiftX = e.clientX - icon.getBoundingClientRect().left;
        let shiftY = e.clientY - icon.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            icon.style.left = pageX - shiftX + 'px';
            icon.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        icon.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);

            const gridSize = 100;
            const taskbarHeight = 40;
            const padding = 10;

            const maxX = window.innerWidth - icon.offsetWidth;
            const maxY = window.innerHeight - icon.offsetHeight - taskbarHeight - padding;

            let rawX = icon.offsetLeft;
            let rawY = icon.offsetTop;

            let snappedX = Math.round(rawX / gridSize) * gridSize;
            let snappedY = Math.round(rawY / gridSize) * gridSize;

            snappedX = Math.max(0, Math.min(snappedX, maxX));
            snappedY = Math.max(0, Math.min(snappedY, maxY));

            icon.style.left = snappedX + 'px';
            icon.style.top = snappedY + 'px';

            icon.onmouseup = null;
        };
    }

    icon.ondragstart = () => false;
});
