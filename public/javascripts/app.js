function App(url){

    const app = io.connect(url);

    app.on('messages', function(message){
        console.log("message:", message);
    });

    return app;
}
