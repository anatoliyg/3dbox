import React from 'react';
import ReactDOM from 'react-dom';

import THREE from 'three';
import ExampleBase from './ExampleBase';

import React3 from 'react-three-renderer';

import Info from './Info';

import PointCloud from './PointCloud';

import TrackballControls from './trackball';
import styles from './App.css';

const perspectiveCameraName = 'perspectiveCamera';
const orthographicCameraName = 'orthographicCamera';
const mainCameraName = 'mainCamera';

const perspectiveCameraRotation = new THREE.Euler(0, Math.PI, 0);
const orthographicCameraRotation = new THREE.Euler(0, Math.PI, 0);

const spherePosition = new THREE.Vector3(0, 0, 150);

class WebGLCameraExample extends ExampleBase {
  constructor(props, context) {
    super(props, context);

    const r = Date.now() * 0.0005;

    this.state = {
      ... this.state,
      meshPosition: new THREE.Vector3(Math.cos(r), Math.sin(r), Math.sin(r)).multiplyScalar(700),
      childPosition: new THREE.Vector3(70 * Math.cos(2 * r), 150, 70 * Math.sin(r)),
      activeCameraName: perspectiveCameraName,
      paused: false,
      mainCameraPosition: new THREE.Vector3(0, 0, 2500),
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown, false);

    const controls = new TrackballControls(this.refs.mainCamera,
      ReactDOM.findDOMNode(this.refs.react3));

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.addEventListener('change', () => {
      this.setState({
        mainCameraPosition: this.refs.mainCamera.position,
      });
    });

    this.controls = controls;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown, false);

    this.controls.dispose();
    delete this.controls;
  }

  _onKeyDown = (event) => {
    switch (event.keyCode) {
      default:
        break;
      case 79: // O
        this.setState({
          activeCameraName: orthographicCameraName,
        });
        break;
      case 80: // P
        this.setState({
          activeCameraName: perspectiveCameraName,
        });

        break;
    }
  };

  _onAnimate = () => {
    this.controls.update();

    if (this.state.paused) {
      return;
    }

    const r = Date.now() * 0.0005;

    this.setState({
      r,
      meshPosition: new THREE.Vector3(Math.cos(r), Math.sin(r), Math.sin(r)).multiplyScalar(700),
      childPosition: new THREE.Vector3(70 * Math.cos(2 * r), 150, 70 * Math.sin(r)),
    });
  };

  _pause = () => {
    this.setState({
      paused: !this.state.paused,
    });
  };

  _frame = () => {
    this.setState({
      paused: false,
    }, () => {
      this._onAnimate();
      this.setState({
        paused: true,
      });
    });
  };

  render() {
    const {
      width,
      height,
    } = this.props;

    const {
      meshPosition,
      childPosition,
      r,
    } = this.state;

    const aspectRatio = 0.5 * width / height;

    return (<div>
      <Info
        pause={this._pause}
        frame={this._frame}
      />
      <React3
        ref="react3"
        width={width}
        height={height}
        antialias
        onAnimate={this._onAnimate}
      >
        <viewport
          x={0}
          y={0}
          width={width / 2}
          height={height}
          cameraName={this.state.activeCameraName}
        />
        <viewport
          x={width / 2}
          y={0}
          width={width / 2}
          height={height}
          cameraName={mainCameraName}
        />
        <scene>
          <perspectiveCamera
            ref="mainCamera"
            name={mainCameraName}
            fov={50}
            aspect={aspectRatio}
            near={1}
            far={10000}
            position={this.state.mainCameraPosition}
          />
          <object3D
            lookAt={meshPosition}
          >
            <perspectiveCamera
              name={perspectiveCameraName}
              fov={35 + 30 * Math.sin(0.5 * r)}
              aspect={aspectRatio}
              near={150}
              far={meshPosition.length()}
              rotation={perspectiveCameraRotation}
            />
            <orthographicCamera
              name={orthographicCameraName}
              left={0.5 * width / -2}
              right={0.5 * width / 2}
              top={height / 2}
              bottom={height / -2}
              near={150}
              far={meshPosition.length()}
              rotation={orthographicCameraRotation}
            />
            <mesh
              position={spherePosition}
            >
              <sphereGeometry
                radius={5}
                widthSegments={16}
                heightSegments={8}
              />
              <meshBasicMaterial
                color={0x0000ff}
                wireframe
              />
            </mesh>
          </object3D>
          <cameraHelper
            cameraName={this.state.activeCameraName}
          />
          <object3D
            position={meshPosition}
          >
            <mesh>
              <sphereGeometry
                radius={100}
                widthSegments={16}
                heightSegments={8}
              />
              <meshBasicMaterial
                color={0xffffff}
                wireframe
              />
            </mesh>
            <mesh
              position={childPosition}
            >
              <sphereGeometry
                radius={50}
                widthSegments={16}
                heightSegments={8}
              />
              <meshBasicMaterial
                color={0x00ff00}
                wireframe
              />
            </mesh>
          </object3D>
          {
            <PointCloud/>
          }
        </scene>
      </React3>
    </div>);
  }
}


ReactDOM.render(<WebGLCameraExample width={window.screen.width} height={window.screen.height}/>, document.getElementById('root'));

export default WebGLCameraExample;


// import React from 'react';
// import React3 from 'react-three-renderer';
// import THREE from 'three';
// import ReactDOM from 'react-dom';

// class Simple extends React.Component {
// 	constructor(props, context) {
// 		super(props, context);

// 		// construct the position vector here, because if we use 'new' within render,
// 		// React will think that things have changed when they have not.
// 		this.cameraPosition = new THREE.Vector3(0, 0, 5);

// 		this.state = {
// 			cubeRotation: new THREE.Euler()
// 		};

// 	}

//   	_onAnimate = () => {
//       // we will get this callback every frame

//       // pretend cubeRotation is immutable.
//       // this helps with updates and pure rendering.
//       // React will be sure that the rotation has now updated.
// 		this.setState({
// 			cubeRotation: new THREE.Euler(this.state.cubeRotation.x + 0.01, this.state.cubeRotation.y + 0.01, 0)
// 		});
//     };

//   	render() {
// 		const width = window.innerWidth; // canvas width
// 	    const height = window.innerHeight; // canvas height

// 	    return (
// 			<React3
// 				mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
// 				width={width}
// 				height={height}
// 				onAnimate={this._onAnimate}>
// 	      	<scene>
// 	        	<perspectiveCamera
// 					name="camera"
// 					fov={75}
// 					aspect={width / height}
// 					near={0.1}
// 					far={1000}
// 	          		position={this.cameraPosition}/>
// 					<mesh rotation={this.state.cubeRotation} >
// 						<boxGeometry
// 							width={1}
// 							height={1}
// 							depth={1} 
// 							/>
// 						<meshBasicMaterial color={0x00ff00} />
// 					</mesh>
// 	      	</scene>
// 	    </React3>);
// 	}
// }

// ReactDOM.render(<Simple/>, document.getElementById('root'));