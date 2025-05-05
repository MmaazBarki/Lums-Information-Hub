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

class TestLoginlogouttesting(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def tearDown(self):
    self.driver.quit()
  
  def test_loginlogouttesting(self):
    self.driver.get("http://localhost:5173/login")
    self.driver.set_window_size(1550, 830)
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("admin@gmail.com")
    self.driver.find_element(By.ID, ":r1:").click()
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.ID, ":r1:").send_keys("123456Q@")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()
    
    time.sleep(2)
    
    try:
        logout_button = self.driver.find_element(By.NAME, "logout")
        logout_button.click()
    except:
        element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) .MuiButtonBase-root")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiSvgIcon-fontSizeSmall").click()
    
    self.assertTrue("http://localhost:5173" in self.driver.current_url)

if __name__ == "__main__":
    unittest.main()