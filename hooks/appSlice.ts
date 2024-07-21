import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum BleState {
  poweredOff  = "poweredOff",
  poweredOn   = "poweredOn",
  resetting   = "resetting",
  unauthorized= "unauthorized",
  unsupported = "unsupported",
  unknown     = "unknown",
}

interface appState {
  robotMode: boolean,
  bleState: BleState,
  connected: number,
  unblocked: number,
  deviceName: string,
}

// Define the initial state using that type
const initialState: appState = {
  robotMode: false,
  bleState: BleState.unknown,
  connected: 0,
  unblocked: 0,
  deviceName: 'My Mouse',
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    connect: (state) => {
      state.connected += 1
    },
    disconnect: (state) => {
      state.connected -= 1
    },
    block: (state) => {
      state.unblocked -= 1
    },
    unblock: (state) => {
      state.unblocked += 1
    },
    setBleState: (state, action: PayloadAction<BleState>) => {
      state.bleState = action.payload
    },
    robotOn: (state) => {
      state.robotMode = true
    },
    robotOff: (state) => {
      state.robotMode = false
    },
    setDeviceName: (state, action: PayloadAction<string>) => {
      state.deviceName = action.payload
    },
  },
})

export const { connect, disconnect, block, unblock, setBleState, robotOn, robotOff, setDeviceName } = appSlice.actions
export default appSlice.reducer