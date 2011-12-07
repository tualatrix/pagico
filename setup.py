import glob
from setuptools import setup, find_packages

setup(name='pagico',
      version='5.1',
      description='Pagico for Linux',
      author='Tualatrix Chou',  
      author_email='tualatrix@gmail.com',
      url='http://www.pagico.com/',
      scripts=['pagico', 'pagico-helper'],
      packages=find_packages(),
      data_files=[
          ('../etc/dbus-1/system.d/', ['data/pagico-daemon.conf']),
          ('share/dbus-1/system-services', ['data/com.pagico.daemon.service']),
          ('share/applications', ['data/pagico.desktop']),
          ('../opt/pagico/', ['pagico-daemon', 'data/splash.png']),
          ],
      license='GNU GPL',
      platforms='linux',
      test_suite='tests',
)
