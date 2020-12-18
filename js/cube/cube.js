var three = THREE;

    var scene = new three.Scene();
    var camera = new three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    var renderer = new three.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);



    var geometry = new three.BoxGeometry(1, 1, 1);
    //var material = new three.MeshNormalMaterial();
    /* * /
    var material = new three.MeshBasicMaterial({
        color: 0x00ff00
    });
    /* */
    /* */
    three.ImageUtils.crossOrigin = '';

    var material = new three.MeshFaceMaterial([
        new three.MeshBasicMaterial({
            color: 0x00ff00
        }),
        new three.MeshBasicMaterial({
            color: 0xff0000
        }),
        new three.MeshBasicMaterial({
            color: 0x0000ff
        }),
        new three.MeshBasicMaterial({
            color: 0xffff00
        }),
        new three.MeshBasicMaterial({
            color: 0x00ffff
        }),
        new three.MeshBasicMaterial({
            color: 0xff00ff
        })
    ]);
    /* */

    var cube = new three.Mesh(geometry, material);
    cube.rotation.x = 0; //Math.PI/4;
    cube.rotation.y = 0; //Math.PI/4;
    scene.add(cube);


    camera.position.z = 5;

    /* */
    var isDragging = false;
    var previousMousePosition = {
        x: 0,
        y: 0
    };
    $(renderer.domElement).on('mousedown', function(e) {
        isDragging = true;
    })
    .on('mousemove', function(e) {
        //console.log(e);
        var deltaMove = {
            x: e.offsetX-previousMousePosition.x,
            y: e.offsetY-previousMousePosition.y
        };

        if(isDragging) {

            var deltaRotationQuaternion = new three.Quaternion()
                .setFromEuler(new three.Euler(
                    toRadians(deltaMove.y * 1),
                    toRadians(deltaMove.x * 1),
                    0,
                    'XYZ'
                ));

            cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
    /* */

    $(document).on('mouseup', function(e) {
        isDragging = false;
    });

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var ReferenceGamma, ReferenceBeta;
    var InitVar = false;
    var Indice = -60; // 60 = temps réel, plus la valeur est grande et moins ca bouge
    var Limit = 10; // le degré maximum

    window.addEventListener('deviceorientation', function(event) {
      // Initialisation des valeurs en fonction de l'orientation de l'appareil, ca sera la valeur de référence.
      if(!InitVar){
        ReferenceGamma = Math.round(event.gamma);
        ReferenceBeta = Math.round(event.beta);
        InitVar = true;
      }

      if(Math.round(event.gamma) < (ReferenceGamma + Limit) && Math.round(event.gamma) > (ReferenceGamma - Limit)){
        // On soustrait ReferenceGamma car il faut prendre en compte l'orientation de référence
        cube.rotation.y = (Math.round(event.gamma) - ReferenceGamma) / Indice;
      } else if(Math.round(event.gamma) > (ReferenceGamma + Limit)){
        cube.rotation.y = Limit / Indice;
      } else {
        cube.rotation.y = -Limit / Indice;
      }
      if(Math.round(event.beta) < (ReferenceBeta + Limit) && Math.round(event.beta) > (ReferenceBeta - Limit)){
        // On soustrait ReferenceBeta car il faut prendre en compte l'orientation de référence
        cube.rotation.x = (Math.round(event.beta) - ReferenceBeta) / Indice;
      } else if(Math.round(event.beta) > (ReferenceBeta + Limit)){
        cube.rotation.x = Limit / Indice;
      } else {
        cube.rotation.x = -Limit / Indice;
      }
    });

    var lastFrameTime = new Date().getTime() / 1000;
    var totalGameTime = 0;
    function update(dt, t) {
        //console.log(dt, t);

        //camera.position.z += 1 * dt;
        //cube.rotation.x += 1 * dt;
        //cube.rotation.y += 1 * dt;

        setTimeout(function() {
            var currTime = new Date().getTime() / 1000;
            var dt = currTime - (lastFrameTime || currTime);
            totalGameTime += dt;

            update(dt, totalGameTime);

            lastFrameTime = currTime;
        }, 0);
    }


    function render() {
        renderer.render(scene, camera);


        requestAnimFrame(render);
    }

    render();
    update(0, totalGameTime);


    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    function toDegrees(angle) {
        return angle * (180 / Math.PI);
    }
