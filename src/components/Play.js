import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
import { auth, firestore, getDocId, getTimestamp, getUniqId } from '../firebase';
import DisplayUserAvatar from './DisplayUserAvatar';
import HowToPlay from './HowToPlay';

function Play()
{
    const [ user ] = useAuthState( auth );
    const query = firestore.collection( 'leaderboards' ).where( 'uid', '==', auth.currentUser?.uid ?? null );
    const [ data, loading ] = useCollectionData( query );

    // if user isnt sign in, sign in 1st
    if ( !user ) return <SignInFirstToPlay />;

    // show load screen while fetching user data
    if ( loading ) return <GameLoading />;

    // if user is signed in and not register, then
    if ( data.length === 0 ) return <RegisterToPlay />;

    return (
        <div className="bg-white">
            {/* <h2>Playing as { lb ? lb[ 0 ].username : '...' }</h2> */ }

            <div id="game">
                <Game />
            </div>
        </div>
    );
}

function GameLoading()
{
    return (
        <div className="py-5 px-2 text-center text-lg bg-white">
            Loading...
        </div>
    );
}

function RegisterToPlay()
{
    return (
        <div className="py-5 px-2 text-center text-lg bg-white">
            You are not register yet.  <Link to={ {
                pathname: '/setup',
                search: '?next=/play'
            } } className="link underline">Click here to register</Link>
        </div>
    );
}

function randomizeWord( _word )
{
    const random = _word.text.split( '' );
    const separated = [ ...random ];
    function shuffle( array )
    {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while ( currentIndex !== 0 )
        {

            // Pick a remaining element...
            randomIndex = Math.floor( Math.random() * currentIndex );
            currentIndex--;

            // And swap it with the current element.
            [ array[ currentIndex ], array[ randomIndex ] ] = [
                array[ randomIndex ], array[ currentIndex ] ];
        }

        return array;
    }

    while ( random.join( '' ) === _word.text )
    {
        shuffle( random );
    }
    return {
        ..._word,
        random: random,
        randomKeys: random.map( n => n.charCodeAt( 0 ) ),
        correct: separated
    };
}


function Game()
{
    // const word = useRandomWord();
    const [ word, setWord ] = useState( null );
    const [ generateNew, setGenerateNew ] = useState( true );
    const [ solve, setSolve ] = useState( [] );

    const [ solved, setSolved ] = useState( false );
    const [ giveUp, setGiveUp ] = useState( false );

    // useEffect( () => console.log( word ), [ word ] );
    useEffect( () =>
    {
        if ( !solved )
        {
            document.addEventListener( 'keyup', handlePlayerType );
        }

        return () =>
        {
            document.removeEventListener( 'keyup', handlePlayerType );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ word, solve, solved ] );

    useEffect( () =>
    {
        return () =>
        {
            setGenerateNew( true );
            setWord( null );
            setSolved( false );
        };
    }, [] );

    useEffect( () =>
    {
        if ( generateNew && !word )
        {
            getRandomWord().then( ( _word ) =>
            {
                // keep generate new word if not found
                if ( _word instanceof Error )
                {
                    console.log( 'Word not found. Search for a new one...' );
                    setWord( w => w === null ? false : null );
                } else
                {
                    // console.log( _word );
                    setWord( assignId( randomizeWord( _word ) ) );
                    setGenerateNew( false );
                    setSolved( false );
                }
            } );
        }
        return () =>
        {
            setSolve( [] );
        };

    }, [ generateNew, word ] );

    useEffect( () =>
    {

        // try to automatically solve user input 
        if ( word && solve.length > 0 && giveUp === false )
        {

            const isFull = solve.length === word.random.length;

            if ( isFull )
            {
                if ( solve.map( char => char.char ).join( '' ) === word.text ) 
                {
                    console.log( 'Solved!' );
                    addUserScore( auth.currentUser.uid );

                    setSolved( true );
                }
                else
                {
                    console.log( 'Wrong! not solve' );
                }
            }
        }
    }, [ word, solve, giveUp ] );

    function addUserScore( id, score = 10 )
    {
        // get previous score
        const lbRef = firestore.collection( 'leaderboards' );

        lbRef.where( 'uid', '==', id ).limit().get()
            .then( docs =>
            {
                if ( !docs.empty )
                {
                    docs.forEach( doc =>
                    {
                        const data = doc.data();

                        // update user score
                        lbRef.doc( id ).update( {
                            score: data.score + score,
                            lastUpdate: getTimestamp()
                        } );
                    } );
                }
            } );


    }


    async function getRandomWord()
    {
        const wordsRef = firestore.collection( 'words' );
        const rnd = getUniqId( wordsRef );
        const query = wordsRef.where( getDocId(), '>=', rnd ).limit( 1 );

        try
        {
            const data = await query.get();
            let word;

            if ( !data.empty )
            {
                // console.log( data );
                data.docs.forEach( doc =>
                {
                    word = doc.data();
                } );

                return word;
            }
            else
            {
                throw Error( 'Failed to fetch word' );
            }
        }
        catch ( e )
        {
            return e;
        }

    }



    function assignId( wordObj )
    {
        return {
            ...wordObj, random: wordObj.random.map( char => (
                {
                    id: v4(),
                    char,
                    code: char.charCodeAt( 0 )
                }
            ) )
        };
    }




    function handleCharAssembleClick( id )
    {
        // push clicked characters to solve list

        const index = word.random.findIndex( ( n ) => n.id === id );
        setSolve( [ ...solve, word.random[ index ] ] );
    }

    function handleCharDissambleClick( id )
    {

        // avoid user dissamble back characters
        if ( solved ) return;

        // remove character from solve list
        const cpy = Array.from( solve );
        const charIndex = cpy.findIndex( ( c ) => c.id === id );
        cpy.splice( charIndex, 1 );

        setSolve( cpy );
    }

    function handlePlayerType( e )
    {
        if ( !word ) return;

        const keyCode = e.key.charCodeAt( 0 );
        const solveCharIds = solve.map( sc => sc.id );

        if ( keyCode === 66 )
        {
            const cpy = Array.from( solve );
            cpy.pop();

            setSolve( cpy );
        }

        if ( word.random.filter( ( char ) => solveCharIds.indexOf( char.id ) < 0 ).map( ( char ) => char.code ).indexOf( keyCode ) < 0 ) return;


        const unusedChars = word.random.filter( ( a ) => solveCharIds.indexOf( a.id ) < 0 );
        const charIndex = unusedChars.find( ( c ) => c.code === keyCode );
        setSolve( ( solve ) => ( [ ...solve, word.random[ word.random.indexOf( charIndex ) ] ] ) );

    }

    function newWord()
    {
        setGiveUp( false );
        setWord( null );
        setGenerateNew( true );
        setSolve( [] );
        setSolved( false );
    }

    function reScramble()
    {
        setSolve( [] );
        word && setWord( w => assignId( randomizeWord( w ) ) );
    }

    function giveUpWord()
    {
        if ( !word ) return;

        setGiveUp( true );
        setSolved( true );
        // setSolve( word.random );
        setSolve( reAssembleWord() );
    }

    function reAssembleWord()
    {
        let correct = [];
        const cpy = Array.from( word.random );

        for ( const _char in word.text.split( '' ) )
        {
            const char = word.text[ _char ];
            const index = cpy.findIndex( ( c ) => c.char === char );
            const e = cpy.splice( index, 1 );
            correct.push( e[ 0 ] );
        }

        return correct;
    }

    function resetSolve()
    {
        setSolve( [] );
    }
    return (
        <div>
            <h1 className="font-bold text-center underline text-2xl mb-2">Game</h1>

            <div id="game-area">
                <b className="px-2">Scramble Characters</b>

                <div id="scramble-area" className="bg-gray-400 px-3 py-2 mb-2 flex flex-wrap align-center min-h-[62px]">
                    {
                        word && word.random.map( char => (
                            <div className="cntainer w-[50px] h-[50px] my-2 mx-1 box-border relative" key={ char.id }>
                                {
                                    solve.findIndex( ( c ) => c.id === char.id ) >= 0
                                        ? ''
                                        : <CreateCharacterCard character={ char } onClick={ () => handleCharAssembleClick( char.id ) } />
                                }
                            </div>
                        ) )
                    }
                </div>

                <b className="px-2">Solve</b>
                <div id="solve" className="p-2 bg-gray-400 mb-2 flex flex-wrap align-center min-h-[62px]">
                    {
                        solve.map( solveChar => (
                            <div className="cntaine w-[50px] h-[50px] my-2 mx-1 bo-border relative" key={ solveChar.id }>
                                <CreateCharacterCard character={ solveChar } onClick={ () => handleCharDissambleClick( solveChar.id ) } />
                            </div>
                        ) )
                    }
                </div>


                <div className="px-2">

                    {/* Correct Message */ }
                    {
                        solved && !giveUp &&
                        <div className="my-2 px-2 py-1 bg-green-300 text-green-800">
                            Correct! You score <b>10</b> points.
                        </div>
                    }

                    {/* Not Correct Message */ }
                    {
                        word && word.text.length === solve.length && !solved && !giveUp &&
                        <div className="my-2 px-2 py-1 bg-red-300 text-red-800">
                            Wrong! Try again.
                        </div>
                    }

                    {/* Give up message */ }
                    {
                        giveUp &&
                        <div className="my-2 px-2 py-1 bg-yellow-100 text-yellow-400 ">
                            You gave up! The correct word is '{ word.text }'
                        </div>
                    }

                    <button
                        onClick={ giveUpWord }
                        disabled={ solved }
                        className="play-btn bg-yellow-500 text-yellow-900"
                    >
                        Give up
                    </button>
                    <button
                        onClick={ reScramble }
                        disabled={ solved }
                        className="play-btn bg-blue-400 text-blue-900 "
                    >
                        Re scramble
                    </button>
                    <button
                        disabled={ solved }
                        className="play-btn bg-gray-300 text-gray-900"
                        onClick={ resetSolve }>
                        Clear
                    </button>
                    { solved &&
                        <button
                            className="play-btn bg-green-300 text-green-900 "
                            onClick={ newWord }
                        >
                            Next
                        </button>
                    }
                </div>
            </div>

            <div id="userThing">
                <DisplayUserAvatar />
            </div>

            <div>
                <HowToPlay />
            </div>
        </div>
    );
}



function CreateCharacterCard( { character, ...props } )
{
    return (
        <div id={ character.id } className="px-5 py-2 bg-black h-full w-full text-white m-1 uppercase font-center relative cursor-pointer" { ...props }>
            <span className="absolute top-[50%] left-[50%] font-bold text-2xl" style={ { transform: 'translate(-50%, -50%)' } } >
                { character.char }
            </span>
        </div>
    );
}

function SignInFirstToPlay()
{
    return (
        <div className=" font-bold text-center text-2xl bg-white">
            <div >
                Sign in first to play!
            </div>

            <Link to="/signin?next=/play" className="underline text-sm block mx-auto my-2">Click here to sign in</Link>
        </div>
    );
}

/* function AddWordForm()
{
    const wordRef = firestore.collection( 'words' );
    const [ wordInput, setWordInput ] = useState( '' );

    async function addWord( e )
    {
        e.preventDefault();
        const id = getUniqId( wordRef );
        await wordRef.doc( id ).set( {
            text: wordInput.toLowerCase(),
            id: id
        } );

        console.log();
    }

    function getRandom( e )
    {
        e.preventDefault();
        const rnd = getUniqId( wordRef );
        console.log( rnd );
        const query = wordRef.where( getDocId(), '>=', rnd ).limit( 1 );
        query.get().then( res => [
            console.log( res )
        ] );
    }

    return (
        <form onSubmit={ addWord }>
            <input
                value={ wordInput }
                onChange={ ( e ) => setWordInput( e.target.value ) }
                type="text" placeholder="word" />

            <button>Add Word</button>
            <button onClick={ getRandom }>Get random</button>
        </form>
    );
} */

export default Play;
