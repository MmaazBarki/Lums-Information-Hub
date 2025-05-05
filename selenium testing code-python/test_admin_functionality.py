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

class TestAdminFunctionality(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def tearDown(self):
    self.driver.quit()
  
  def test_admin_functionality(self):
    self.driver.get("http://localhost:5173/login")
    self.driver.set_window_size(1550, 830)
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("admin@gmail.com")
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.ID, ":r1:").send_keys("123456Q@")
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()
    
    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(6) .MuiTypography-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(6) .MuiTypography-root").click()

    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiTableRow-root:nth-child(3) .MuiSvgIcon-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiTableRow-root:nth-child(3) path").click()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-textError").click()
    
    self.driver.find_element(By.ID, "admin-tab-1").click()

    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiTableRow-root:nth-child(1) .MuiSvgIcon-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiTableRow-root:nth-child(1) .MuiSvgIcon-root").click()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-textError").click()
    
    self.driver.find_element(By.ID, "admin-tab-2").click()

    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiTableRow-root:nth-child(1) .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiTableRow-root:nth-child(1) .MuiButtonBase-root").click()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-textError").click()
    
    
    try:
        logout_button = self.driver.find_element(By.NAME, "logout")
        logout_button.click()
    except:
        try:
            logout_icon = self.driver.find_element(By.CSS_SELECTOR, ".MuiSvgIcon-fontSizeSmall")
            logout_icon.click()
        except:
            pass
    
    self.assertTrue("http://localhost:5173" in self.driver.current_url or "login" in self.driver.current_url)

if __name__ == "__main__":
    unittest.main()