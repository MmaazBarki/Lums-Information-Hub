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

class TestTestingaddresource(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def tearDown(self):
    self.driver.quit()
  
  def test_testingaddresource(self):
    self.driver.get("http://localhost:5173/login")
    self.driver.set_window_size(1550, 830)
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("maazbarki+7@gmail.com")
    self.driver.find_element(By.ID, ":r1:").click()
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.ID, ":r1:").send_keys("123456Q@")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()
    
    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(4) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(4) > .MuiButtonBase-root").click()
    
    time.sleep(2)
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root:nth-child(5)")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root:nth-child(5)").click()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".css-293mih")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".css-293mih").click()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
    
    element = self.driver.find_element(By.NAME, "topic")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.NAME, "topic").click()
    self.driver.find_element(By.NAME, "topic").send_keys("upload re-testing")
    
    element = self.driver.find_element(By.NAME, "description")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.NAME, "description").click()
    self.driver.find_element(By.NAME, "description").send_keys("selenium testing")
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-fullWidth")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-fullWidth").click()

    time.sleep(5)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root > input")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root > input").send_keys("C:\Users\maazb\OneDrive\文档\Documents\Report_4_Group_1.pdf")
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".css-moh2zj-MuiButtonBase-root-MuiButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".css-moh2zj-MuiButtonBase-root-MuiButton-root").click()
    
    self.assertEqual(self.driver.switch_to.alert.text, "Resource uploaded successfully!")
    
    time.sleep(2)
    
    try:
        logout_button = self.driver.find_element(By.NAME, "logout")
        logout_button.click()
    except:
        element = self.driver.find_element(By.CSS_SELECTOR, ".css-120dh41-MuiSvgIcon-root")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()
        self.driver.find_element(By.CSS_SELECTOR, ".css-120dh41-MuiSvgIcon-root").click()
    
    self.assertTrue("http://localhost:5173" in self.driver.current_url)

if __name__ == "__main__":
    unittest.main()

