import React from 'react';
import "./SearchPage.css";
import { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Button } from '@material-ui/core';
import RecipeCard from '../Components/RecipeCard/RecipeCard';

const optionsCategorys = [
    { value: 'Veg', label: 'Veg' },
    { value: 'Non-Veg', label: 'Non-Veg' },
    { value: 'Vegan', label: 'Vegan' },
];

const optionsMeals = [
    { value: 'Breakfast', label: 'Breakfast' },
    { value: 'Lunch', label: 'Lunch' },
    { value: 'Dinner', label: 'Dinner' },
    { value: 'Snack', label: 'Snack' }
];

const optionsCuisines = [
    { value: 'American', label: 'American' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Maxicon', label: 'Maxicon' },
    { value: 'Chinese', label: 'Chinese' }
];

export default function SearchPage() {

    const [ingredients, setIngredients] = useState([]);
    const [chefnames, setChefnames] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [mealTypes, setMealtypes] = useState([]);
    const [optionsIngs, setOptionings] = useState([]);
    const [optionChefs, setOptionchefs] = useState([]);
    const [preparationTime, setPreparationtime] = useState(0);
    const [cuisines, setCuisines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [recipes, setRecipes] = useState([]);

    const changeCategorys = (event) => {
        let categories = [];
        event.map(e => categories.push(e.label));
        setCategorys(categories);
    };

    const changeChefs = (event) => {
        let chef = [];
        event.map(e => chef.push(e.label));
        setChefnames(chef);
    };

    const changeIngs = (event) => {
        let ing = [];
        event.map(e => ing.push(e.label));
        setIngredients(ing);
    };

    const changeMeals = (event) => {
        let meals = [];
        event.map(e => meals.push(e.label));
        setMealtypes(meals);
    };

    const changeCuisines = (event) => {
        let cuisines = [];
        event.map(e => cuisines.push(e.label));
        setCuisines(cuisines);
    };

    const changepreparationTime = (event) => {
        setPreparationtime(event.target.value);
    };

    const handleButtonclick = (event) => {
        event.preventDefault();
        const body = {
            ingredients: ingredients,
            chefnames: chefnames,
            cuisines: cuisines,
            categorys: categorys,
            mealTypes: mealTypes,
            preparationTime: preparationTime
        };
        console.log(body);
        axios
            .post(`https://naivebakerr.herokuapp.com/query/search`, body)
            .then((res) => {
                setRecipes(res.data.data.recipes);
            }
            )
    };

    useEffect(() => {

        const fetch = () => {

            setIsError(false);
            setLoading(true);

            let one = `https://naivebakerr.herokuapp.com/query/chefs`;
            let two = `https://naivebakerr.herokuapp.com/query/ingredients`;

            const requestOne = axios.get(one);
            const requestTwo = axios.get(two);

            axios
                .all([requestOne, requestTwo])
                .then(
                    axios.spread((...responses) => {
                        const responseOne = responses[0];
                        const responseTwo = responses[1];
                        const optionchef = responseOne.data.data.chefs.map(d => ({
                            "value": d,
                            "label": d

                        }));
                        const optioning = responseTwo.data.data.ingredients.map(d => ({
                            "value": d,
                            "label": d

                        }));
                        setOptionchefs(optionchef);
                        setOptionings(optioning);
                    })
                )
                .catch(err => {
                    setIsError(true);
                    console.log(err);
                })
            setLoading(false);
        }

        fetch();
    }, []);

    return (
        <>
            {isError && <div>Something went wrong ...</div>}
            {loading === false &&
                <div className="main">
                    <div className="search">
                        <Select
                            isMulti
                            className='select-category'
                            options={optionsCategorys}
                            placeholder={'Recipe Category'}
                            onChange={changeCategorys}
                        />
                        <Select
                            isMulti
                            className='select-meal'
                            options={optionsMeals}
                            placeholder={'Recipe Meal Types'}
                            onChange={changeMeals}
                        />
                        <Select
                            isMulti
                            className='select-cuisine'
                            options={optionsCuisines}
                            placeholder={'Recipe Cuisine Types'}
                            onChange={changeCuisines}
                        />
                        <Select
                            isMulti
                            className='select-chef'
                            options={optionChefs}
                            placeholder={'Chefs'}
                            onChange={changeChefs}
                        />
                        <Select
                            isMulti
                            className='select-ingredient'
                            options={optionsIngs}
                            placeholder={'Recipe Ingredients'}
                            onChange={changeIngs}
                        />
                        <label>
                            Preparation Time
                            <input type="number" value={preparationTime} onChange={changepreparationTime} />
                        </label>
                        <Button onClick={handleButtonclick} variant="outlined" color="primary">
                            Submit
                        </Button>
                    </div>
                    <div className="line">
                        <hr></hr>
                    </div>
                    <div className="result">
                        {
                            recipes !== undefined && recipes.map(r => <RecipeCard r={r}/>)
                        }
                    </div>
                </div>
            }
        </>
    )
}