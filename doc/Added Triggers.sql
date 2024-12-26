-- trigger to calculate BMI on insert
DELIMITER $$
CREATE TRIGGER bmi_calc_update
BEFORE UPDATE ON Users
FOR EACH ROW
BEGIN
    IF (NEW.Height != OLD.Height) OR (NEW.weight != OLD.weight) THEN
        SET NEW.BMI = NEW.weight / (NEW.Height * NEW.Height);
    END IF;
END;$$
DELIMITER ;

-- same but for updates
DELIMITER $$
CREATE TRIGGER bmi_calc_insert
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    SET NEW.BMI = NEW.weight / (NEW.Height * NEW.Height);
END;$$
DELIMITER ;