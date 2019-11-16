const Application = {
    storageKey: 'trelloClone',
    // Функция сохранения текущего состояния в local storage
    save() {
        const object = {
            columns: {
                idCounter: Column.idCounter,
                items: []
            },
            notes: {
                idCounter: Note.idCounter,
                items: []
            }
        };
        // Заполняем object.columns
        document.querySelectorAll('.column')
            .forEach(columnElement => {
                //Создаем объект column для временного хранения номеров ид записей в соответсвующих их расположению колонках
                const column = {
                    header: columnElement.querySelector('.column-header').textContent,
                    id: parseInt(columnElement.getAttribute('data-column-id')),
                    noteIds: []
                };
                console.log(column.id)
                // Собираем из DOM айдишники всех записей и помещаем в объект
                columnElement
                    .querySelectorAll('.note')
                    .forEach(noteElement => {
                        column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
                    });
                // Записываем из временной переменной в основной объект, который в дальнейшем будем преобразовывать в json    
                object.columns.items.push(column);
            });

        // Заполняем object.notes
        document
        // выбираем все заметки
            .querySelectorAll('.note')
            .forEach(noteElement => {
        // создаем переменную для хранения  
                const note = {
        // преобразуем в числовой формат значение аттрибута с id и записываем содержимое заметок в контент             
                    id: parseInt(noteElement.getAttribute('data-note-id')),
                    content: noteElement.textContent
                };
        // записываем переменную note в соответвующее поле глобального объекта object        
                object.notes.items.push(note);
            });
        // преобразовали в json 
        const json = JSON.stringify(object);
        // записали в local storage
        localStorage.setItem(Application.storageKey, json);


    },

    // Загрузка данных их хранилища
    load() {
        // проверка на наличие записей
        if (!localStorage.getItem(Application.storageKey)) {
            return
        };

        // Очистка содержимого боди
        const mountePoint = document.querySelector('.columns');
        mountePoint.innerHTML = '';

        // Получаем объект данных из local storage
        const object = JSON.parse(localStorage.getItem(Application.storageKey));

        const getNoteById = id => object.notes.items.find(note => note.id === id);
        // Циклом создаем и выводим в DOM колонки из объекта
        for (let { id, header, noteIds } of object.columns.items) {
            let column = new Column(id);
            column.element.querySelector('.column-header').textContent = header;
            mountePoint.append(column.element);

            // Цикл для поиска и добавления в колонки нужных заметок по id
            for (let noteId of noteIds) {
                let { id, content} = getNoteById(noteId);
                let note = new Note(id, content);
                column.add(note);
                console.log(id, header,noteIds)
            };
        }
    }   
}
