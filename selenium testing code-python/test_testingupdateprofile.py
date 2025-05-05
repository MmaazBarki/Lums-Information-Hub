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

class TestTestingupdateprofile(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Firefox()
    self.vars = {}
  
  def tearDown(self):
    self.driver.quit()
  
  def test_testingupdateprofile(self):
    self.driver.get("http://localhost:5173/login")
    self.driver.set_window_size(1550, 830)
    self.driver.find_element(By.ID, ":r0:").click()
    self.driver.find_element(By.ID, ":r0:").send_keys("faraz@gmail.com")
    self.driver.find_element(By.ID, ":r1:").click()
    self.driver.find_element(By.ID, ":r1:").send_keys("123456Q@")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root").click()

    time.sleep(2)

    self.driver.find_element(By.CSS_SELECTOR, ".css-f9wnpn-MuiTypography-root").click()
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-textInherit").click()
    self.driver.find_element(By.ID, ":rl:").click()
    self.driver.find_element(By.ID, ":rl:").clear()
    self.driver.find_element(By.ID, ":rl:").send_keys("i was faraz, i am now bilal")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButtonBase-root:nth-child(13)").click()
    self.driver.find_element(By.ID, ":rp:").click()
    self.driver.execute_script("window.scrollTo(0,0)")
    self.driver.find_element(By.ID, ":rp:").clear()
    self.driver.find_element(By.ID, ":rp:").send_keys("2026")
    self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-icon path").click()

    time.sleep(2)

    self.assertTrue("Profile updated" in self.driver.page_source or "bilal" in self.driver.page_source)

    try:
        logout_button = self.driver.find_element(By.NAME, "logout")
        logout_button.click()
    except:
        try:
            logout_icon = self.driver.find_element(By.CSS_SELECTOR, ".MuiSvgIcon-fontSizeSmall")
            logout_icon.click()
        except:
            pass

if __name__ == "__main__":
    unittest.main()

