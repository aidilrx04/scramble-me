import React from 'react';

function HowToPlay()
{
    return (
        <div className="px-2 ">
            <h3 className="font-bold my-2 mt-5 text-xl">How To Play</h3>

            <ol className="list-disc pl-4">
                <li className="list-item">
                    Click the character cards to add or remove from the Solve box.
                </li>
                <li>
                    Type the characters using your keyboard to add them into the Solve box.
                </li>
                <li>
                    Press <kbd>Backspace</kbd> to remove the last character from the Solve box.
                </li>
                <li>
                    Click <kbd>Give up</kbd> to give up and see the correct answer.
                </li>
                <li>
                    Click <kbd>Re scramble</kbd> to rescramble the characters.
                </li>
                <li>
                    Click <kbd>Clear</kbd> to clear characters from the Solve box
                </li>
                <li>
                    Click <kbd>Next</kbd>  to go to the next word.
                </li>
            </ol>
        </div>
    );
}

export default HowToPlay;
