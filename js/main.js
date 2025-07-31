console.log("main.js loaded");

document.addEventListener('contextmenu', e=> e.preventDefault());

function isOverllpaing(rect1, rect2) {
    return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
    );
}

document.addEventListener("DOMContentLoaded", () => {

    // clock setup
    function updateClock() {
        const clock = document.getElementById('taskbar-clock');
        const now = new Date();

        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString([], { day: '2-digit', month: 'short', year: '2-digit' });

        clock.textContent = `${time} | ${date}`;
    }

    updateClock();
    setInterval(updateClock, 60000);

    // desktop icon dragging
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

    // selection box logic
    const desktop = document.querySelector('.desktop');
    let selectionBox = null;
    let startX = 0;
    let startY = 0;

    desktop.addEventListener('mousedown', (e) => {
        if (e.target !== desktop) return;

        startX = e.pageX;
        startY = e.pageY;

        selectionBox = document.createElement('div');
        selectionBox.classList.add('selection-box');
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        desktop.appendChild(selectionBox);

        function onMouseMove(e) {
            const currentX = e.pageX;
            const currentY = e.pageY;

            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            const left = Math.min(currentX, startX);
            const top = Math.min(currentY, startY);

            selectionBox.style.width = `${width}px`;
            selectionBox.style.height = `${height}px`;
            selectionBox.style.left = `${left}px`;
            selectionBox.style.top = `${top}px`;

            const icons = document.querySelectorAll('.desktop-icon');
            const boxRect = selectionBox.getBoundingClientRect();

            icons.forEach(icon => {
                const iconRect = icon.getBoundingClientRect();

                const isOverlapping =
                    boxRect.left < iconRect.right &&
                    boxRect.right > iconRect.left &&
                    boxRect.top < iconRect.bottom &&
                    boxRect.bottom > iconRect.top;

                if (isOverlapping) {
                    icon.classList.add('selected');
                } else {
                    icon.classList.remove('selected');
                }
            });
        }

        function onMouseUp(e) {
            const deltaX = Math.abs(e.pageX - startX);
            const deltaY = Math.abs(e.pageY - startY);

            const wasClick = deltaX < 5 && deltaY < 5;

            if (selectionBox) {
                selectionBox.remove();
                selectionBox = null;
            }

            if (wasClick) {
                document.querySelectorAll('.desktop-icon').forEach(icon => {
                    icon.classList.remove('selected');
                });
            }

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mouseup', onMouseUp);

        document.addEventListener('mousemove', onMouseMove);
    });
});
