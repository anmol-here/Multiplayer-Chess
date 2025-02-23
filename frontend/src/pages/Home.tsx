import Loader from "../utils/Loader";

const Home = ({ socket ,loading , setLoading }: { socket: WebSocket , loading:boolean , setLoading:(loading:boolean)=>void }) => {

    const playOnline = () => {
        socket?.send(JSON.stringify({ type: "init_game" }))
        setLoading(true);
    }

    if (loading) {
        return (
            <Loader />
        )
    }
    
    return (
        // <div className=' bg-[#302E2B] w-full h-full flex flex-col items-center justify-center'>
            <div className=" w-3/4 flex">
                <img className=" w-[40%]" src="/board.png" alt="" />
                <div className=" w-full flex flex-col items-center p-20 text-white font-poppins">
                    <p className=" text-5xl font-semibold text-center">Play Chess Online</p>
                    <p className=" text-5xl font-semibold text-center mt-2">on the #2 Site!</p>
                    <div className=" w-full flex flex-col items-center gap-4 mt-10">
                        <button onClick={playOnline} className=" w-[50%] p-6 text-2xl font-semibold bg-[#81B64C] rounded-lg shadow-sm shadow-[#81B64C] transform transition-transform hover:translate-y-[-2px]">Play Online</button>
                        <button className="w-[50%] p-6 text-2xl font-semibold bg-[#454341] rounded-lg shadow-sm shadow-[#454341] transform transition-transform hover:translate-y-[-2px]">Play Bots</button>
                    </div>
                </div>
            </div>
        // </div>

    )
}

export default Home