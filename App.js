import React, { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
// import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(
        JSON.parse(localStorage.getItem("newNotes")) || []
    );

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    );

    useEffect(() => {
        localStorage.setItem("newNotes", JSON.stringify(notes));
        // const splitWords = (notes[4].body).split("\n\n")[0];
    }, [notes]);


    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    /* function updateNote(text) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote
        }))
    } */

    const newArray = [];
    
    function updateNote(text) {
        // Put the most recently-modified note at the top
        setNotes(oldNotes => {
            
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray;
        });
    }

    function deleteNote(noteHolderId) {
        // const noteIndex = notes.indexOf(noteHolderId);
        // console.log(noteHolderId);

        setNotes(prevNotes => prevNotes.filter(
            prevNote => prevNote.id !== noteHolderId
        ));

        // console.log("Index is", noteIndex);
       // for (let i = 0; i < notes.length; i++) {}
        /* if (noteIndex > -1) {
            setNotes(oldNotes => 
                oldNotes.filter(
                    (oldNote) => !oldNote
                    // () => !oldNotes.splice(noteIndex, 1)
                )

            );
            
            console.log("Deleted");
        }
        else {
            console.log("Nothing to see here");
        } 
        */
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteFunc={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create new note
                </button>
            </div>
            
        }
        </main>
    )
}
