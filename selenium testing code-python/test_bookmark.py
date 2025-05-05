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

class TestBookmark(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def tearDown(self):
    self.driver.quit()
  
  def test_bookmark(self):
    self.driver.get("http://localhost:5173/login")
    self.driver.set_window_size(1936, 1048)
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("maazbarki+10@gmail.com")
    self.driver.find_element(By.ID, ":r1:").click()
    self.driver.find_element(By.ID, ":r1:").send_keys("123456Q@")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()
    
    time.sleep(2)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(4) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(5) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(4) .MuiTypography-root").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".Mui-selected")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(5) > .MuiButtonBase-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root:nth-child(3) .MuiTypography-body1").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) > .MuiPaper-root > .MuiButtonBase-root:nth-child(1)")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(3) > .MuiPaper-root .MuiCardContent-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiSvgIcon-root").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(3) > .MuiPaper-root > .MuiButtonBase-root > .MuiSvgIcon-root").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(5) .MuiCardContent-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(4) .MuiCardContent-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(4) .MuiButtonBase-root > .MuiSvgIcon-root").click()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root:nth-child(4) .MuiTypography-body2").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiCardContent-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiSvgIcon-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(1) > .MuiPaper-root > .MuiButtonBase-root > .MuiSvgIcon-root").click()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root:nth-child(5) .MuiTypography-body2").click()
    
    time.sleep(1)
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) > .MuiPaper-root > .MuiButtonBase-root:nth-child(1)")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(2) > .MuiPaper-root > .MuiButtonBase-root > .MuiSvgIcon-root").click()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(2) .MuiTypography-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element_with_offset(element, 0, 0).perform()
    
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(1) > .MuiButtonBase-root")
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
    
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItem-root:nth-child(5) .MuiTypography-root").click()

if __name__ == "__main__":
    unittest.main()

