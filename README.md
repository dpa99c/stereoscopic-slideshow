Stereoscopic slideshow
======================

This repo demonstrates how a slideshow can be created to render stereoscopic side-by-side images in 3D using a VR headset.
It uses [A-frame](https://aframe.io/) and specifically [aframe-stereo-component](https://github.com/oscarmarinmiro/aframe-stereo-component) as building blocks.

The SPA loads a set of side-by-side images in JPS (JPEG Stereo) format from a web server which are displayed as 2D thumbnails in the page.
Clicking one of the images launches the slideshow in immersive VR using the browser's [WebXR API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) and displays the selected image in the slideshow UI.

VR headsets with stereo displays will render each half of the side-by-side image to the relevant eye, so it appears to the viewer in stereoscopic 3D.
The slideshow UI has buttons to load the next/previous image in the set and move the UI closer or further away.
The controllers for the various [VR headsets supported by A-frame](https://aframe.io/docs/1.2.0/introduction/vr-headsets-and-webvr-browsers.html#which-vr-headsets-does-a-frame-support) are wired up so they can also be used to operate the slideshow controls.

The slideshow will still work on devices without immersive VR support by the images will be rendered in 2D.

You can view the slideshow demo here: https://dpa99c.github.io/stereoscopic-slideshow/
