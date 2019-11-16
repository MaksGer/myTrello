class Column {
    constructor(id = null) {
        const instance = this;
        // массив хранения заметок 
        this.notes = [];
        // создание колонки
        const element = this.element = document.createElement('div');
        element.classList.add('column');
        element.setAttribute('draggable', 'true');
        if (id) {
            element.setAttribute('data-column-id', id)
        } else {
            element.setAttribute('data-column-id', Column.idСounter)
            Column.idCounter++;
        };
        element.innerHTML = `
        <p class="column-header" contenteditable="true">В плане</p>
		<div data-notes></div>
		<p class="column-footer">
			<span data-action-addNote class="action">+ Добавить карточку</span>
        </p>`;
        // Функционал добавления новой заметки
        const spanAction_addNote = element.querySelector('[data-action-addNote]');
        spanAction_addNote.addEventListener('click', function (event) {
            const note = new Note;
            instance.add(note);
            element.querySelector('[data-notes]').append(note.element);
            note.element.setAttribute('contenteditable', 'true');
            note.element.focus();
        });

        const headerElement = element.querySelector('.column-header')
        headerElement.addEventListener('dblclick', function (event) {
            element.removeAttribute('draggable')
            headerElement.setAttribute('contenteditable', 'true')
            headerElement.focus()
        })

        headerElement.addEventListener('blur', function (event) {
            headerElement.removeAttribute('contenteditable')
            element.setAttribute('draggable', 'true')

            Application.save()
        })

        element.addEventListener('dragstart', this.dragstart.bind(this));
        element.addEventListener('dragend', this.dragend.bind(this));
        element.addEventListener('dragover', this.dragover.bind(this));
        element.addEventListener('drop', this.drop.bind(this));
    };

    // добавление заметки в объект и DOM
    add (...notes) {
        for (const note of notes) {
            if (!this.notes.includes(note)) {
                this.notes.push(note);
                this.element.querySelector('[data-notes]').append(note.element);
            };
        };
    };

    dragstart(event) {
        Column.dragged = this.element;
        Column.dragged.classList.add('dragged');

        event.stopPropagation();

        document
            .querySelectorAll('.note')
            .forEach(noteElement => noteElement.removeAttribute('draggable'));
    };

    dragend(event) {
        this.element.classList.remove('dragged');
        Column.dragged = null;
        Column.dropped = null;
        document
            .querySelectorAll('.note')
            .forEach(noteElement => noteElement.setAttribute('draggable', 'true'));
            document
            .querySelectorAll('.column')
            .forEach(columnElement => columnElement.classList.remove('under'));
        Application.save();
    };

    dragover(event) {
        event.preventDefault();
        event.stopPropagation();
        if (Column.dragged === this.element) {
            if (Column.dropped) {
                Column.dropped.classList.remove('under')
            };
            Column.dropped = null;
        };

        if (!Column.dragged || Column.dragged === this.element) {
            return
        };
        Column.dropped = this.element;
        document
            .querySelectorAll('.column')
            .forEach(columnElement => columnElement.classList.remove('under'));
        this.element.classList.add('under');
    };

    drop() {
        if (Note.dragged) {
            return this.element.querySelector('[data-notes]').append(Note.dragged);
        } else if (Column.dragged) {
            const columnsElement = document.querySelector('.columns'),
                children = Array.from(columnsElement.children),
                indexA = children.indexOf(this.element),
                indexB = children.indexOf(Column.dragged);

            if (indexA < indexB) {
                columnsElement.insertBefore(Column.dragged, this.element);
            } else {
                columnsElement.insertBefore(Column.dragged, this.element.nextElementSibling);
            }

        }
        document
            .querySelectorAll('.column')
            .forEach(columnElement => columnElement.classList.remove('under'));
    }
}
Column.idCounter = 4;
Column.dragged = null;
Column.dropped = null;

// const Column = {
//     IdCounter: 4,
//     dragged: null,
//     dropped: null,

// process(columnElement) {
//     const spanAction_addNote = columnElement.querySelector('[data-action-addNote]');
//     spanAction_addNote.addEventListener('click', function (event) {
//         const noteElement = Note.create();
//         columnElement.querySelector('[data-notes]').append(noteElement);
//         noteElement.setAttribute('contenteditable', 'true');
//         noteElement.focus();
//     });


//     columnElement.addEventListener('dragstart', Column.dragstart);
//     columnElement.addEventListener('dragend', Column.dragend);
//     columnElement.addEventListener('dragover', Column.dragover);
//     columnElement.addEventListener('drop', Column.drop);
// },

// create (id = null) {
//     const columnElement = document.createElement('div');
//     columnElement.classList.add('column');
//     columnElement.setAttribute('draggable', 'true');
//     if (id) {
//         columnElement.setAttribute('data-column-id', id)
//     } else {
//         columnElement.setAttribute('data-column-id', Column.idСounter)
//         Column.idCounter++; 
//     };
//     columnElement.innerHTML = `
//     <p class="column-header" contenteditable="true">В плане</p>
// 	<div data-notes></div>
// 	<p class="column-footer">
// 		<span data-action-addNote class="action">+ Добавить карточку</span>
// 	</p>`;
//     Column.process(columnElement);
//     return columnElement;
// },

// dragstart(event) {
//         Column.dragged = this;
//         Column.dragged.classList.add('dragged');

//         event.stopPropagation();

//         document
//             .querySelectorAll('.note')
//             .forEach(noteElement => noteElement.removeAttribute('draggable'));
//     },

//     dragend(event) {
//         Column.dragged.classList.remove('dragged');
//         Column.dragged = null;
//         Column.dropped = null;
//         document
//             .querySelectorAll('.note')
//             .forEach(noteElement => noteElement.setAttribute('draggable', 'true'));
//         Application.save();
//     },

//     dragover(event) {
//         event.preventDefault();
//         event.stopPropagation();
//         if (Column.dragged === this) {
//             if (Column.dropped) {
//                 Column.dropped.classList.remove('under')
//             };
//             Column.dropped = null;
//         };

//         if (!Column.dragged || Column.dragged === this) {
//             return
//         };
//         Column.dropped = this;
//         document
//             .querySelectorAll('.column')
//             .forEach(columnElement => columnElement.classList.remove('under'));
//         this.classList.add('under');
//     },

//     drop() {
//         if (Note.dragged) {
//             return this.querySelector('[data-notes]').append(Note.dragged);
//         } else if (Column.dragged) {
//             const children = Array.from(document.querySelector('.columns').children),
//                 indexA = children.indexOf(this),
//                 indexB = children.indexOf(Column.dragged);

//             if (indexA < indexB) {
//                 document.querySelector('.columns').insertBefore(Column.dragged, this);
//             } else {
//                 document.querySelector('.columns').insertBefore(Column.dragged, this.nextElementSibling);
//             }

//         }
//         document
//             .querySelectorAll('.column')
//             .forEach(columnElement => columnElement.classList.remove('under'));
//     }
// }