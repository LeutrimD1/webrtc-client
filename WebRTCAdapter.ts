// WebRTCAdapter.ts
import { Platform } from 'react-native';

// Type definitions
export type RTCPeerConnectionType = typeof RTCPeerConnection;
export type RTCPeerConnectionInstance = RTCPeerConnection;
export type RTCIceCandidate = any;
export type RTCSessionDescription = any;

let RTCPeerConnection: RTCPeerConnectionType;
let mediaDevices: any;

if (Platform.OS === 'web') {
  // Browser environment
  RTCPeerConnection = window.RTCPeerConnection;
  mediaDevices = navigator.mediaDevices;
} else {
  // React Native environment
  const mobile = require('react-native-webrtc');
  RTCPeerConnection = mobile.RTCPeerConnection;
  mediaDevices = mobile.mediaDevices;
}

export { RTCPeerConnection, mediaDevices };