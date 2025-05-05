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

class TestMessaging(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def tearDown(self):
    self.driver.quit()
  
  def test_messaging(self):
    self.driver.get("http://localhost:5173/login")
    self.driver.set_window_size(1936, 1048)
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("maazbarki+10@gmail.com")
    self.driver.find_element(By.ID, ":r1:").click()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.ID, ":r1:").send_keys("123456Q@")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()
    
    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(2) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(2) > .MuiButtonBase-root .MuiTypography-root").click()
    
    time.sleep(1)
    
    self.driver.find_element(By.ID, ":rk:").click()
    self.driver.find_element(By.ID, ":rk:").send_keys("admin")
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-padding:nth-child(3)").click()
    
    time.sleep(1)
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiInputBase-multiline").click()
    self.driver.find_element(By.ID, ":rr:").send_keys("geez louise")
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".css-15m2yu3-MuiButtonBase-root-MuiIconButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".css-15m2yu3-MuiButtonBase-root-MuiIconButton-root").click()
    
    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".css-1f1934s-MuiButtonBase-root-MuiIconButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".css-1f1934s-MuiButtonBase-root-MuiIconButton-root").click()
    
    time.sleep(1)
    
    self.driver.find_element(By.ID, ":rt:").click()
    self.driver.find_element(By.ID, ":rt:").send_keys("admin@gmail.com")
    self.driver.find_element(By.ID, ":ru:").click()
    self.driver.find_element(By.ID, ":ru:").send_keys("123456Q@")
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()
    
    time.sleep(2)
    
    self.driver.find_element(By.CSS_SELECTOR, ".Mui-selected").click()
    
    time.sleep(1)
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiIconButton-colorInherit").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiBackdrop-root").click()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(2) > .MuiButtonBase-root").click()
    
    time.sleep(1)
    
    self.driver.find_element(By.ID, ":r1k:").click()
    self.driver.find_element(By.ID, ":r1k:").send_keys("i am ")
    
    time.sleep(1)
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-padding").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".css-1f1934s-MuiButtonBase-root-MuiIconButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    self.driver.find_element(By.CSS_SELECTOR, ".css-1f1934s-MuiButtonBase-root-MuiIconButton-root").click()
    
    time.sleep(1)
    self.assertTrue("http://localhost:5173" in self.driver.current_url or "login" in self.driver.current_url)

if __name__ == "__main__":
    unittest.main()

