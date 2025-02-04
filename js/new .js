    var renderer,
    	scene,
    	camera,
    	myCanvas = document.getElementById('myCanvas');

    //RENDERER
    renderer = new THREE.WebGLRenderer({
      canvas: myCanvas,
      antialias: true
    });
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //CAMERA
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000 );

    //SCENE
    scene = new THREE.Scene();

    //LIGHTS
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light2);


    var loader = new THREE.JSONLoader();
    // loader.load('monkey.json', handle_load);

    loader.load('models/monkey/monkey_animated.json', handle_load);

    var mesh;
    var mixer;

    function handle_load(geometry, materials) {

        //BASIC MESH
        // var material = new THREE.MultiMaterial(materials);
        // mesh = new THREE.Mesh(geometry, material);
        // scene.add(mesh);
        // mesh.position.z = -10;

        //ANIMATION MESH
        var material = new THREE.MeshLambertMaterial({morphTargets: true});

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position.z = -10;


        //MIXER
        mixer = new THREE.AnimationMixer(mesh);

        var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('talk', geometry.morphTargets, 30);
        mixer.clipAction(clip).setDuration(1).play();
    }


    //RENDER LOOP
    render();

    var delta = 0;
    var prevTime = Date.now();

    function render() {

        delta += 0.1;

        if (mesh) {

            //mesh.rotation.y += 0.01;

            //animation mesh
            // mesh.morphTargetInfluences[ 0 ] = Math.sin(delta) * 20.0;
        }

        if (mixer) {
            var time = Date.now();
            mixer.update((time - prevTime) * 0.001);
            prevTime = time;
        }

    	renderer.render(scene, camera);

    	requestAnimationFrame(render);
    }

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
        mesh.rotation.y = (Math.round(event.gamma) - ReferenceGamma) / Indice;
      }//} else if(Math.round(event.gamma) > (ReferenceGamma + Limit)){
      //  mesh.rotation.y = Limit / Indice;
      //} else {
      //  mesh.rotation.y = -Limit / Indice;
      //}
      if(Math.round(event.beta) < (ReferenceBeta + Limit) && Math.round(event.beta) > (ReferenceBeta - Limit)){
        // On soustrait ReferenceBeta car il faut prendre en compte l'orientation de référence
        mesh.rotation.x = (Math.round(event.beta) - ReferenceBeta) / Indice;
      } //else if(Math.round(event.beta) > (ReferenceBeta + Limit)){
      //  mesh.rotation.x = Limit / Indice;
      //} else {
      //  mesh.rotation.x = -Limit / Indice;
      //}
    });
    
