import { Color } from "chess.js";
import { Link } from "react-router-dom";

interface GameOverProps {
    reason:string;
    isWinner:Color;
    color: Color | undefined;
}

const GameOver:React.FC<GameOverProps> = ({isWinner , color}) => {
    return(
        <div className=" w-screen h-screen z-10 absolute flex items-center justify-center backdrop-blur-sm ">
            <div className=" flex flex-col items-center justify-center bg-red-200 w-1/4 h-1/2 p-10 rounded-md">
            {isWinner === color && <h1 className='mb-10 font-medium text-3xl text-center'>Yay! You won the Match🥳🍾</h1>}
            {isWinner !== color && <h1 className='mb-10 font-medium text-3xl text-center'>Oops! You lose the match😟</h1>}
            <Link to={"/"} className=" p-2 bg-black text-white rounded-md">Home</Link>
            </div>
        </div>
    )
}

export default GameOver;