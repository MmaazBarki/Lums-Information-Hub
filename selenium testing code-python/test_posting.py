# filepath: c:\Users\maazb\OneDrive\Desktop\Software Engineering\selenium testing code-python\test_posting.py
import unittest
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class Testposting(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def tearDown(self):
    self.driver.quit()
  
  def test_posting(self):
    self.driver.get("http://localhost:5173/login")
    self.driver.set_window_size(1550, 830)
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("maazbarki+10@gmail.com")
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.ID, ":r1:").send_keys("123456Q@")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()
    
    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(4) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()

    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(3) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(2) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(3) > .MuiButtonBase-root .MuiTypography-root").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".Mui-selected")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-contained").click()
    self.driver.find_element(By.ID, ":ro:").click()
    self.driver.find_element(By.ID, ":ro:").send_keys("test this if you can")
    self.driver.find_element(By.ID, ":rp:").click()
    self.driver.find_element(By.ID, ":rp:").send_keys("not enjoying this one bit")
    self.driver.find_element(By.CSS_SELECTOR, ".css-moh2zj-MuiButtonBase-root-MuiButton-root").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".css-1f1934s-MuiButtonBase-root-MuiIconButton-root").click()

if __name__ == "__main__":
    unittest.main()

