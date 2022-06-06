import {NativeModules} from 'react-native';
import MediaStreamTrack from './MediaStreamTrack';
import RTCRtpCapabilities, { getCapabilities } from './RTCRtpCapabilities';

const {WebRTCModule} = NativeModules;


export default class RTCRtpSender {
    _id: string;
    _track: MediaStreamTrack;
    _peerConnectionId: number;
    _capabilities: RTCRtpCapabilities[] = [];

    constructor(info: { pId: number, id: string, track: MediaStreamTrack }) {
        this._peerConnectionId = info.pId;
        this._id = info.id;
        this._track = info.track;
    }

    replaceTrack = (track: MediaStreamTrack | null) => {
        return new Promise<void>((resolve, reject) => {
            // Find a way to not use peer connection id inside transceiver
            WebRTCModule.peerConnectionTransceiverReplaceTrack(this._peerConnectionId, this._id, track ? track.id : null, (successful, data) => {
                if (successful) {
                    resolve();
                } else {
                    reject(new Error(data));
                }
            });
        });
    }
    
    static getCapabilities(kind: "audio" | "video"): RTCRtpCapabilities {
        if (kind === "audio") {
            throw new Error("Unimplemented capabilities for audio");
        }
        const capabilities = getCapabilities('sender');
        if (!capabilities)
            throw new Error('capabilities is not yet initialized');
        return capabilities;
    }

    get track() {
        return this._track;
    }

    get id() {
        return this._id;
    }
}