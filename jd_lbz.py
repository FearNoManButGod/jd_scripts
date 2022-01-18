import requests,json,os,time,random

time.sleep(random.randint(1,600))
try:
    from sendNotify import send
except:
    send = None



def env(key):
    return os.environ.get(key)

if env( "JD_COOKIE" ) :
        cookies = env( "JD_COOKIE" ).split( '&' )        
else:
        print('获取不到ck')
        exit()

url = 'https://api.m.jd.com/client.action?functionId=tigernian_collectAutoScore'

date = {
        "functionld":"tigernian_collectAutoScore",
        "body":r'''{"ss":"{\"extraData\":{\"log\":\"1641811155976~1sXIZyvRF2KMDFmYkJiZjAxMQ==.V1R2U15XUnRWX1RUcRwKISRzLlYzA3pVGFdOdU5fSlM8UBhXHDw=.d520db3f~9,1~D3B922B45E25610A21F0EBFB7B665DABEB3FBE0C~09owgpt~C~TENHWxYNPhpSBRsMAR94cB5zAFN7GlUbERoaEVICHgsFHn11GyYEBGYbBBRCERoWVwUaCgAYeFYfcQMFMRRXH0IWHxFTBB8MBU18AhhwUgtuH1cYRxFqHhBAWQwRDG8VAQ0bCwQYfHYbdQUGdU1SGkAVSRpSBhsDeB90aB5zDjhmGlUbERoaEVIDHgR8HnFuGyZyBmQbBBRCEWsYEVRFXBAOBk0RRUcVXxoHBQIFCwIHAQsCBFgABQECXBoaEUFRVxENEEZAQxVHUEFRRxQURFNVEQkVVFRAQxVHQ1UVSRpGV1gWCWgOHgEAAE0BGgcbVBQDbhoWWVkVCAMYFQJAFA4VXQlTUAcGA1EOU1NRBFADVAwAUVwDAAJSAwICCgsAVAURGhZZFRoMEV9kW1xZVxAYFRURDAUBUQkOAgcFBgYOBQQYFQtYFA4VVVkOUlMBAQcPBABWAgVWBQAEA11SUQUNUlIHAQYHAFQKB1UFBAlVURQYEVVHUBAOFUMfFFpBRwIUckZEX1YXcV1ZRxRHU0YbRXFYUBgWHxFZU0QWDUMCAAMOVwoUHxRHUEEVCGkMDlcfAgUDOBQUQVkWCWgVW2JcWA9WBwYbVBoaEV97YBEbEAMBGVMRGhYGVRYFHQQWHxEGBAUNBVMRGhYHBABXVgMGBwsBAFABUwQAAgdRAFxUAA9VUgMEBgEDAlgCVwZWVFtUERoWUhFqHhBdWAARDBZRA15QVVBARxEbEFNeFVsRQxYbR1tfEQwWRAAZBhwEFU0RVVJoExoMEQYFER8VUFYWDUNBV1pTClULCwYGBQcAAwMWG0NeXBYNPgkEHwIYB24bEFBYWAYRDBYGUwwHCwcEAAQFCgQESVBfWlJSF2EFe1Bifndxe1BxbSZScnVPK3kLDhhRZUNOVgMNTzl7YExvLX5jVUxTW3lhWUZ4YVFAfmUOVX5cBndkdEN0aHQEAwJxbAFyD08OfndfW31AY2tSZCRkZncHFnpnUGdjVAZVfHBXVTtKfxtRHV9Da3VfY2RmYwNwXlFwUEMDLHF1anxlSVAceWAMbixUVUJ9VAx9V3cABHVeAl5sQFkYUnxUC11eWEBxZlByYnMEdSNLd3d7C35VdnIAfX5hZANxUFwOGA1TXFxSBANQTUobA0xKSSNNZWZ9N2BkcnlxdXp2elV5YylLfGByJE9iZE51ZnZxXnFxUAZgc3ZQNGl0cnpxYnp9cEV5ZClxdGJhVwlzdFFTZHJQd2N8dSN0c3UDNH1OC2Vjdn5lcVp9dCZUc3d2Al9ndHR2YXZ2XWNyXFkOSARSDAFMSk8WHxFaQVUWDUMRSw==~0szdrut\",\"sceneid\":\"ZNShPageh5\"},\"secretp\":\"m2BozRx8Uh9B7QyjIL-CXij7hSc\",\"random\":\"80264711\"}"}''',
        "client":"wh5",
        "clientVersion":"1.0.0"
}
def head(cookies):
            headres = { "Host"            : "api.m.jd.com" ,
                        "Content-Type"    : "application/x-www-form-urlencoded" ,
                        "Origin"          : "https://wbbny.m.jd.com" ,
                        "Accept-Encoding" : "gzip, deflate, br" ,
                        "Cookie"          : cookies ,
                        "Accept"          : "application/json, text/plain, */*" ,
                        "User-Agent"      : "jdapp;iPhone;10.3.2;;;M/5.0;appBuild/167922;jdSupportDarkMode/0;ef/1;ep/%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22ud%22%3A%22CQO4YWU1CtG4DtTsDWHvCzGzZwVuYtC5YWOmCzGzDzU5CWOyYJPtYq%3D%3D%22%2C%22sv%22%3A%22CJUkCq%3D%3D%22%2C%22iad%22%3A%22%22%7D%2C%22ts%22%3A1641810396%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D;Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;" ,
                        "Referer"         : "https://wbbny.m.jd.com/" ,
                        "Content-Length"  : "1715" ,
                        "Connection"      : "keep-alive" ,
                        "Accept-Language" : "zh-CN,zh-Hans;q=0.9"
            
                        }
            return headres
com = ''
for cook in cookies:
            
            respon = requests.post( url = url , headers = head(cook) , data = date )
            re = respon.text
            
            re = json.loads(re)
            produceScore = re['data']['result']['produceScore']
            success = re['data']['success']
            msg = re['msg']
            print( re )
            if msg == '调用成功' and success == True:
                com += cook+ '\n\n' +produceScore + '\n\n' + msg+ '\n\n' + str(success)
            
            else:
                com += cook+ '\n\n' + '错误'
print(com)
send('自动收爆竹',com)