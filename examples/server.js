'use strict';

var pmp = require('../');
var fs = require("fs");

if(process.argv.length !=4) {
  console.log("Usage: node server.js <host> <port>");
  process.exit(1);
}

var server = pmp.createServer({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  name: 'MCPE;Minecraft: PE Server;45 45;0.14.1;0;20'
});

server.on('connection', function(client) {


  client.on("mcpe",packet => {
    console.log(packet);
  });
  client.on("mcpe_login",packet => {
    client.writeMCPE("mcpe_player_status",{
      status:0
    });
    client.writeMCPE('mcpe_move_player', {
      entity_id: [0,0],
      x: 1,
      y: 64 + 1.62,
      z: 1,
      yaw: 0,
      head_yaw: 0,
      pitch: 0,
      mode: 0,
      on_ground: 1
    });

    client.writeMCPE("mcpe_start_game",{
      seed:-1,
      dimension:0,
      generator:1,
      gamemode:0,
      entity_id:[0,0],
      spawn_x:1,
      spawn_y:1,
      spawn_z:1,
      x:0,
      y:1+1.62,
      z:0,
      unknown:0
    });

    client.writeMCPE('mcpe_set_spawn_position', {
      x: 1,
      y: 64,
      z: 1
    });
    client.writeMCPE("mcpe_set_time",{
      time:0,
      started:1
    });

    client.writeMCPE('mcpe_respawn', {
      x: 1,
      y: 64,
      z: 1
    });
  });

  client.on("mcpe_request_chunk_radius",packet => {
    const chunkRadius = packet.chunk_radius;
    // TODO : to fix, no idea what to send

    for (let x = 0; x < 1; x++) {
      for (let z = 0; z < 1; z++) {
        client.writeBatch([{"name":"mcpe","params":{name:"mcpe_full_chunk_data",params:{
        chunk_x: x,
        chunk_z: z,
        order: 1,
        chunk_data:fs.readFileSync(__dirname+"/chunk")
        }}}]);
      }
    }

    client.writeMCPE('mcpe_player_status', {
      status: 3
    });

    client.writeMCPE('mcpe_set_time', {
      time: 0,
      started: 1
    });

  });

  client.on('error', function(err) {
    console.log(err.stack);
  });
});