class Note {
    constructor (id = null, content = '') {
            const instance = this,
                element = this.element = document.createElement('div');
        
            // Создаем заметку 
            element.classList.add('note');
            element.setAttribute('draggable', 'true');
            element.textContent = content;
            if (id) {
                element.setAttribute('data-note-id', id)
            } else {
                element.setAttribute('data-note-id', Note.idCounter)
                Note.idCounter++;
            };
            element.addEventListener('dblclick', function (event) {
                element.setAttribute('contenteditable', 'true');
                element.removeAttribute('draggable');
                instance.column.removeAttribute('draggable');
                element.focus();
            });
            element.addEventListener('blur', function (event) {
                element.removeAttribute('contenteditable');
                element.setAttribute('draggable', 'true');
                instance.column.setAttribute('draggable', 'true');
                if (!element.textContent.trim().length) {
                    element.remove();
                };
                Application.save();
            });
            element.addEventListener('dragstart', this.dragstart.bind(this));
            element.addEventListener('dragend', this.dragend.bind(this));
            element.addEventListener('dragenter', this.dragenter.bind(this));
            element.addEventListener('dragover', this.dragover.bind(this));
            element.addEventListener('dragleave', this.dragleave.bind(this));
            element.addEventListener('drop', this.drop.bind(this));
    };

    get column() {
        return this.element.closest('.column');
    };

    dragstart(event) {
        Note.dragged = this.element;
        this.element.classList.add('dragged');
        event.stopPropagation();
    };
    
    dragend(event) {
        event.stopPropagation();
        Note.dragged = null;
        this.element.classList.remove('dragged');
        document
            .querySelectorAll('.note')
            .forEach(x => x.classList.remove('under'));
        Application.save();
    };
    
    dragenter(event) {
        if (!Note.dragged || this.element === Note.dragged) {return}
        this.element.classList.add('under');
        event.stopPropagation();
    };
    
    dragover(event) {
        event.preventDefault();
        if (!Note.dragged || this.element === Note.dragged) {return}
        // event.stopPropagation();
    };
    
    dragleave(event) {
        if (!Note.dragged || this.element === Note.dragged) {return}
        this.element.classList.remove('under')
        event.stopPropagation();
    };
    
    drop(event) {
        // event.stopPropagation();
        if (!Note.dragged || this.element === Note.dragged) {return};
        if (this.element.parentElement === Note.dragged.parentElement) {
            const note = Array.from(this.element.parentElement.querySelectorAll('.note')),
                  indexA = note.indexOf(this.element),
                  indexB = note.indexOf(Note.dragged);
            if (indexA < indexB) {
                this.element.parentElement.insertBefore(Note.dragged, this.element);
            }    else {
                this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling);
            }
        } else {
            this.element.parentElement.insertBefore(Note.dragged, this.element)
        };
        
    };
};

Note.idCounter = 1;
Note.dragged = 0;
// const Note = {
//     idCounter:  8,
//     dragged: null,

//     process (element) {
//         element.addEventListener('dblclick', function (event) {
//             element.setAttribute('contenteditable', 'true');
//             element.removeAttribute('draggable');
//             element.closest('.column').removeAttribute('draggable');
//             element.focus();
//         });
//         element.addEventListener('blur', function (event) {
//             element.removeAttribute('contenteditable');
//             element.setAttribute('draggable', 'true');
//             element.closest('.column').setAttribute('draggable', 'true');
//             if (!element.textContent.trim().length) {
//                 element.remove();
//             };
//             Application.save();
//         });
//         element.addEventListener('dragstart', Note.dragstart);
//         element.addEventListener('dragend', Note.dragend);
//         element.addEventListener('dragenter', Note.dragenter);
//         element.addEventListener('dragover', Note.dragover);
//         element.addEventListener('dragleave', Note.dragleave);
//         element.addEventListener('drop', Note.drop);
//     },

//     create(id = null, content = '') {
//         const element = document.createElement('div');
//             element.classList.add('note');
//             element.setAttribute('draggable', 'true');
//             element.textContent = content;
//             if (id) {
//                 element.setAttribute('data-note-id', id)
//             } else {
//                 element.setAttribute('data-note-id', Note.idCounter)
//                 Note.idCounter++;
//             };
//             Note.process(element);
//             return element
//     },

//     dragstart(event) {
//         Note.dragged = this;
//         this.classList.add('dragged');
//         event.stopPropagation();
//     },
    
//     dragend(event) {
//         event.stopPropagation();
//         Note.dragged = null;
//         this.classList.remove('dragged');
//         document
//             .querySelectorAll('.note')
//             .forEach(x => x.classList.remove('under'));
//         Application.save();
//     },
    
//     dragenter(event) {
//         if (!Note.dragged || this === Note.dragged) {return}
//         this.classList.add('under');
//         event.stopPropagation();
//     },
    
//     dragover(event) {
//         event.preventDefault();
//         if (!Note.dragged || this === Note.dragged) {return}
//         event.stopPropagation();
//     },
    
//     dragleave(event) {
//         if (!Note.dragged || this === Note.dragged) {return}
//         this.classList.remove('under')
//         event.stopPropagation();
//     },
    
//     drop(event) {
//         // event.stopPropagation();
//         if (!Note.dragged || this === Note.dragged) {return};
//         if (this.parentElement === Note.dragged.parentElement) {
//             const note = Array.from(this.parentElement.querySelectorAll('.note')),
//                   indexA = note.indexOf(this),
//                   indexB = note.indexOf(Note.dragged);
//             if (indexA < indexB) {
//                 this.parentElement.insertBefore(Note.dragged, this);
//             }    else {
//                 this.parentElement.insertBefore(Note.dragged, this.nextElementSibling);
//             }
//         } else {
//             this.parentElement.insertBefore(Note.dragged, this)
//         }
        
//     }
// }
