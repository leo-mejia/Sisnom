        const dateInput = document.getElementById('fecha-display');
        const datepicker = document.getElementById('datepicker');
        const grid = document.getElementById('datepickerGrid');
        const monthYearLabel = document.getElementById('monthYear');

        let currentDate = new Date();
        let selectedDate = null;

        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const days = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

        function renderCalendar() {
            grid.innerHTML = '';
            monthYearLabel.innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

            days.forEach(d => {
                const dayEl = document.createElement('div');
                dayEl.className = 'weekday';
                dayEl.innerText = d;
                grid.appendChild(dayEl);
            });

            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                grid.appendChild(document.createElement('div'));
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'day';
                dayEl.innerText = d;

                const today = new Date();
                if (d === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                    dayEl.classList.add('today');
                }

                if (selectedDate && d === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear()) {
                    dayEl.classList.add('selected');
                }

                dayEl.onclick = (e) => {
                    e.stopPropagation();
                    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                    dateInput.value = selectedDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    datepicker.style.display = 'none';
                    renderCalendar();
                };
                grid.appendChild(dayEl);
            }
        }

        dateInput.onclick = (e) => {
            e.stopPropagation();
            const isVisible = datepicker.style.display === 'block';
            datepicker.style.display = isVisible ? 'none' : 'block';
        };

        document.getElementById('prevMonth').onclick = (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        };

        document.getElementById('nextMonth').onclick = (e) => {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        };

        window.onclick = () => datepicker.style.display = 'none';
        datepicker.onclick = (e) => e.stopPropagation();

        renderCalendar();

        document.getElementById('registroForm').onsubmit = (e) => {
            e.preventDefault();
            alert('Empleado registrado exitosamente en SISNOM');
            window.location.href = 'iniciosisnom.html';
        };