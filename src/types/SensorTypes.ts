export interface Sensor {
  id: string;
  name: string;
  device_id: string;
  type: string;
  unit: string;
  inUse: boolean;
  key: SensorsTypes;
  vector: boolean;
}

export type SensorsTypes = 'accel' | 'gyro' | 'magnet' | 'temp' | 'humi';
