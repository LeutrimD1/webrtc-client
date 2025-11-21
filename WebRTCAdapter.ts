// WebRTCAdapter.js
import { Platform } from 'react-native';

let RTCPeerConnection: typeof window.RTCPeerConnection;
let RTCSessionDescription: typeof window.RTCSessionDescription;
let RTCIceCandidate: typeof window.RTCIceCandidate;
let mediaDevices: MediaDevices;

if (Platform.OS === 'web') {
  // Use browser's native WebRTC
  RTCPeerConnection = window.RTCPeerConnection;
  RTCSessionDescription = window.RTCSessionDescription;
  RTCIceCandidate = window.RTCIceCandidate;
  mediaDevices = navigator.mediaDevices;
} else {
  // Use react-native-webrtc for mobile
  const WebRTC = require('react-native-webrtc');
  RTCPeerConnection = WebRTC.RTCPeerConnection;
  RTCSessionDescription = WebRTC.RTCSessionDescription;
  RTCIceCandidate = WebRTC.RTCIceCandidate;
  mediaDevices = WebRTC.mediaDevices;
}

export { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices };