import DatePicker from "react-datepicker"; //ライブラリ
import "react-datepicker/dist/react-datepicker.css"; //ライブラリ
import "./timePicker.css";

export interface TimePickerProps {
  value: Date | null;
  onChange: (time: Date | null) => void;
  readOnly?: boolean;
}

export function TimePicker({
  value,
  onChange,
  readOnly = false,
}: TimePickerProps) {
  return (
    <DatePicker
      className="w-full border border-text p-1 rounded-lg"
      dateFormat="HH:mm" // 時刻フォーマット
      selected={value} // 選択された日時
      onChange={onChange} // 変更時のハンドラ
      showTimeSelect // 時刻選択を有効化
      showTimeSelectOnly // 時刻選択のみに限定
      timeIntervals={5} // 時刻の選択間隔
      timeFormat="HH:mm" // 時刻フォーマット
      readOnly={readOnly}
    />
  );
}
