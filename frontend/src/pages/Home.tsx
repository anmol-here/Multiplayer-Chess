const Home = ({ socket ,loading , setLoading }: { socket: WebSocket , loading:boolean , setLoading:(loading:boolean)=>void }) => {

    const playOnline = () => {
        socket?.send(JSON.stringify({ type: "init_game" }))
        setLoading(true);
    }

    if (loading) {
        return (
            <div>Finding a Player</div>
        )
    }
    
    return (
        <div className=''>
            <button onClick={playOnline}>Play Online</button>
        </div>

    )
}

export default Home