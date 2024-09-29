import React from 'react';
import { Select, SelectItem, Chip } from "@nextui-org/react";
import styles from './style.module.scss';

interface CustomSelectProps {
  name: string;
  label: string;
  options: { id: number; name: string }[];
  value: number[];
  onChange: (values: number[]) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ name, label, options, value, onChange }) => {
    const selectedKeys = new Set(value.map(String));

    return (
        <div className={styles.selectWrapper}>
            <label className={styles.selectLabel}>{label}</label>
            <Select
                name={name}
                items={options}
                selectionMode="multiple"
                placeholder="選択してください"
                labelPlacement="outside"
                classNames={{
                    base: styles.select,
                    trigger: styles.selectTrigger,
                    value: styles.selectValue,
                }}
                selectedKeys={selectedKeys}
                renderValue={(items) => (
                    <div className={styles.selectedTags}>
                        {items.map((item) => (
                            <Chip key={item.key} className={styles.chip}　variant="bordered">
                                {options.find(option => option.id.toString() === item.key)?.name || item.textValue}
                            </Chip>
                        ))}
                    </div>
                )}
                onSelectionChange={(keys) => {
                    const selectedValues = Array.from(keys as Set<string>).map(Number);
                    onChange(selectedValues);
                }}
            >
                {(option) => <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>}
            </Select>
        </div>
    );
};

export default CustomSelect;