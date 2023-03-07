import React, { useState, useEffect } from "react";
import "../Components/Administration.css";
import { db } from "./Firebase";
import { collection, addDoc, query, where, getDocs, setDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";


function AdminPanel(props) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newWord, setNewWord] = useState("");
    const [newQuestion, setNewQuestion] = useState("");
    const [words, setWords] = useState([]);
    const [allWords, setAllWords] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            const q = query(collection(db, "categories"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => doc.data().category);
            setCategories(data);
        };
        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchAllData = async () => {
            const q = query(collection(db, "categories"));
            const querySnapshot = await getDocs(q);
            const categoriesData = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const words = data.words || [];
                return { category: data.category, words };
            });
            const allWordsData = categoriesData.reduce((acc, curr) => {
                const { category, words } = curr;
                const categoryWordsData = words.map((word) => ({ category, ...word }));
                return acc.concat(categoryWordsData);
            }, []);
            setAllWords(allWordsData);
        };
        fetchAllData();
    }, []);


    useEffect(() => {
        const fetchAllWords = async () => {
            const q = query(collection(db, "words"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => doc.data());
            setAllWords(data);
        }
        fetchAllWords();

    }, []);



    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (newCategory !== "") {
            await setDoc(doc(db, "categories", newCategory), {
                category: newCategory,
            });
            setCategories([...categories, newCategory]);
            setNewCategory("");
        }
    };


    const handleAddWord = async (e) => {
        e.preventDefault();
        if (newWord !== "" && newQuestion !== "") {
            const categoryDocRef = doc(db, "categories", selectedCategory);
            const categoryDoc = await getDoc(categoryDocRef);

            if (categoryDoc.exists()) {
                const categoryData = categoryDoc.data();
                const words = categoryData.words || [];
                words.push({ word: newWord, question: newQuestion });

                await updateDoc(categoryDocRef, { words });

                setNewWord("");
                setNewQuestion("");

                setAllWords([...allWords, { category: selectedCategory, word: newWord, question: newQuestion }]);

            }
        }
    };

    const handleDeleteWord = async (wordId) => {
        const categoryDocRef = doc(db, "categories", selectedCategory);
        const categoryDoc = await getDoc(categoryDocRef);

        if (categoryDoc.exists()) {
            const categoryData = categoryDoc.data();
            const words = categoryData.words || [];
            const updatedWords = words.filter((word) => word.id !== wordId);

            await updateDoc(categoryDocRef, { words: updatedWords });

            const updatedAllWords = allWords.filter((word) => word.id !== wordId);
            setAllWords(updatedAllWords);
        }
    };


    const handleSelectCategory = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleCategoryChange = async (e) => {
        const category = e.target.value;
        setSelectedCategory(category);

        const categoryDocRef = doc(db, "categories", category);
        const categoryDoc = await getDoc(categoryDocRef);

        if (categoryDoc.exists()) {
            const categoryData = categoryDoc.data();
            const words = categoryData.words || [];
            setWords(words);
        }
    };


    return (
        <div className="admin-container">
            <h1>Administration</h1>
            <div className="categories-container">
                <form onSubmit={handleAddCategory}>
                    <div className="form-group">
                        <label htmlFor="new-category">Add category:</label>
                        <input
                            type="text"
                            id="new-category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button type="submit">Add</button>
                    </div>
                </form>
                <hr />
                <div className="category-select">
                    <label htmlFor="category-select">Select category:</label>
                    <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <div>
                        <h2>Data in {selectedCategory}:</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Word</th>
                                    <th>Question</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {words.map((word) => (
                                    <tr key={word.id}>
                                        <td>{word.word}</td>
                                        <td>{word.question}</td>
                                        <td><button onClick={() => handleDeleteWord(word.id)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                {selectedCategory && (
                    <form onSubmit={handleAddWord}>
                        <hr />
                        <div className="form-group">
                            <label htmlFor="new-word">Add word:</label>
                            <input
                                type="text"
                                id="new-word"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                            />
                            <br/>
                            <label htmlFor="new-question">Add question:</label>
                            <input
                                type="text"
                                id="new-question"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                            />
                            <button type="submit">Add</button>
                        </div>
                    </form>
                )}
                {allWords.length > 0 && (
                    <>
                        <h2>Added Data:</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Word</th>
                                    <th>Question</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allWords.map((word) => (
                                    <tr key={word.id}>
                                        <td>{word.category}</td>
                                        <td>{word.word}</td>
                                        <td>{word.question}</td>
                                        <td><button onClick={() => handleDeleteWord(word.id)}>Delete</button></td>
                                        <hr />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

            </div>
        </div>
    );
}


export default AdminPanel;
