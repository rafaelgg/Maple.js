/**
  * Copyright (c) 2012 Ivo Wetzel.
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  * THE SOFTWARE.
  */
var Maple = require('../Maple');


// Test -----------------------------------------------------------------------
var TestServer = Maple.Class(function(clientClass) {

    Maple.Server(this, clientClass, [
        'echo'
    ]);

}, Maple.Server, {

    started: function() {
        this.log('Started');
    },

    update: function(t, tick) {
        if (tick % 50 === 0) {
            this.broadcast('echo', ['Server', tick, this.getRandom()]);
        }
    },

    stopped: function() {
        this.log('Stopped');
    },

    connected: function(client) {
        this.log('Client has connected:', client.id, client.isBinary);
    },

    message: function(client, type, tick, data) {
        this.log('New Message received:', client, type, tick, data);
    },

    requested: function(req, res) {
        this.log('HTTP Request');
    },

    disconnected: function(client) {
        this.log('Client has disconnected:', client.id);
    }

});


var TestClient = Maple.Class(function(server, conn, isBinary) {
    Maple.ServerClient(this, server, conn, isBinary );

}, Maple.ServerClient, {

    message: function(type, tick, data) {
        console.log('Client got message:', type, tick, data);
    }

});


var srv = new TestServer(TestClient);
srv.start({
    port: 4000,
    logicRate: 10 // only update logic every 10 ticks
});

