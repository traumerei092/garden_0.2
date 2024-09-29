import React from 'react';
import {Checkbox, Input, Card, CardBody} from "@nextui-org/react";
import styles from './style.module.scss';

const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];

interface OpeningHours {
  [key: string]: { open: string; close: string; isOpen: boolean };
}

interface OpeningHoursInputProps {
  value: OpeningHours;
  onChange: (value: OpeningHours) => void;
}

const OpeningHoursInput: React.FC<OpeningHoursInputProps> = ({ value, onChange }) => {
  const handleChange = (day: string, field: 'open' | 'close' | 'isOpen', newValue: string | boolean) => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        [field]: newValue,
        open: field === 'isOpen' && newValue ? (value[day]?.open || '10:00') : value[day]?.open,
        close: field === 'isOpen' && newValue ? (value[day]?.close || '22:00') : value[day]?.close
      }
    });
  };

  return (
    <Card className={styles.openingHoursCard}>
      <CardBody>
        <h3 className={styles.openingHoursTitle}>営業時間</h3>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayRow}>
            <Checkbox
              isSelected={value[day]?.isOpen}
              onValueChange={(isChecked: boolean) => handleChange(day, 'isOpen', isChecked)}
              className={styles.dayCheckbox}
            >
              <span className={styles.dayLabel}>{day}</span>
            </Checkbox>
            {value[day]?.isOpen && (
              <>
                <Input
                  type="time"
                  aria-label={`${day}開店時間`}
                  value={value[day]?.open || ''}
                  onChange={(e) => handleChange(day, 'open', e.target.value)}
                  className={styles.timeInput}
                  classNames={{
                    input: styles.inputInner,
                    inputWrapper: styles.inputWrapper
                  }}
                />
                <span className={styles.timeSeparator}>-</span>
                <Input
                  type="time"
                  aria-label={`${day}閉店時間`}
                  value={value[day]?.close || ''}
                  onChange={(e) => handleChange(day, 'close', e.target.value)}
                  className={styles.timeInput}
                  classNames={{
                    input: styles.inputInner,
                    inputWrapper: styles.inputWrapper
                  }}
                />
              </>
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default OpeningHoursInput;