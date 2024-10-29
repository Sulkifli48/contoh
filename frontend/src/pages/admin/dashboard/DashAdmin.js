// src/pages/AdminDashboard.js
import React from 'react';
import Sidebar from '../../../components/sidebar/Sidebar';
import "./Style.css";

const Iclass = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACGElEQVR4nO1ZTWvVUBC9Cn5Ql4qIv0CrLqRFqOhMSynV/gfd+RBE3puJ4jL+AF24LFgEl6VvJr6FUArdWJcqtIuuuqsL134t/KjchFcqpvQ1id5E5sBASDL3zrlnzkCIcwaDwWAwVAAkeY2sW00KYF35k0gNCsMCYUSwBiqgKcLhTx5NEQ53ysDyDqPueWjLWEMVkZ9I+vja3ZdHfE1XSS41jwjpByCd6dcDlNwEkk9NI7KI9+ZPZXX0TgBrMmhuLYgA6VdgaTu3dcDXMM46CSyb+1mjUiJAugacXMROMoqsG4PlyepE58U5v7f3BLI8Sj2yz70rIwIkz6eixWP9dSbvyHFkWd7D0LMjrd5Qtu/CGSR5W3R/V5aIN6I35HZ+pDcgkuv+ejieP4ykc3sZGjtyG1k+l+kGV4YIkK4D6YU0L352FFmfpPdZvwPpg+3JE2kLSL5lz2Tp8v3kdBFD418hQjrXbwtoy1nvj5z2eepVycaozuw0NHB3CkneV0ECCxL5giS3fmsl1o+7qsa6MhZ1T/bfH2nNHkLSh0j6oyoSWIhIJxnNCuoN5fZ/fmz4vHSilTA0VquIXPEF5bdSuHBlp1ZdwhkRDq8CmiIc/uTRFOEB+nE3xPFBZH3TfCIu/cKb+C+IjLNON59IHLC1DHUBNvC/COb9JwldRGVewRoUYUR4hyK+v0KfZtkA0lehZ43BYHD/Br8A/6tCLeVKEC0AAAAASUVORK5CYII='
const IStudy = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADJElEQVR4nO2YPWgUURDHF4miaJNCFIQIsVJQiDZC7maSgIWN4ldh4VeTwuh5M5ciKmRBq6RSQSGVICjhyM1c4oHaGDWFjSJEDEoUkaBgBLEwGkgRebu38XL5uMt5H7uyf3jwePdm5v327Xszt5YVKlSoUKH+J6E9XBeNyykkfWea07eH66zAyLZXIcsxB4B1NrcBy0dIaLu/geylAYIBZBcP4E8gu3QAfwDZ5QOoDZBdOYDqANnVA8CKANUQAMsC5CMALAXIy8TAMr6sM5IZIH0BJHeAxY5yqgMT6aPRRBrggmyPnE9ujHRl6k3bYSfXeP5N3xs3c8xcY+PYcqrD+ALj0/U9UwBofEGlUDQA6wNkOW4WYlVYka5MvYkFJA+LBgLSkQI78LMlLgdzA7V2yrYW0iPAchlIbiBJP7A+QZI3yDqJJN9NA5bpnKDT3jiSfjVzszb9xofjKyGHje/cWEDpQ8gytfwadaQgCJKcc3bubHIDsF5F1g8VPwuk74Hkyr7Eo/UuTCq2vI08K/hqtcUGNznOWF7V4IC/dB5iZ3Lzis9K/uS536sPMbtU/EUB8pU72W8gUAzAggVnd8gvINGV/jHLd7AAxL15niLLTWBhTOgJSMh+4HRTJD7Q2Eb3t3j5Yi8l13n2pu+NO3PiA43ReGq3Y0vpk8YXkN5yfJsYS6zjn0HchKU7rSop0jm4y8Qs2UGhJ4H27bUQ1yiyngaSbiTtA9KMycjIOmauZyCdcPII6Y+5M2f67thE9gofc7O4Zlwf0u1eNhIxMUoGKASClD5jck5ukqtUA9LfJjeYmGUHyT7xqh50YH1edhCTZc07W6U/Vm9NyeJl9rKC5Ko1MbDV1F9IchFZryPLXWR5DKSvkeTzXE3F+mve6/J3/AuyjGZt7rm1ll4CTh9ojg01lLz4lYIEQhiC+EwY7ohPhPZwHZL05NRUPf76NlukgLV3kYTUawVNQPJtkeQ0aQVN4BZzeSDyyQqawHwNyQchvWYFTc2xoYb5n11kqmzlQrWFbu3kgXRZQdWe9r7V2WJu1PStIAs43WRardcRKlQoq6z6A4DT7XcvUaipAAAAAElFTkSuQmCC'
const IBook = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACtklEQVR4nO1az2sTURDek3rQQ0E8+OOoh6p/QGMyEwuiB63+DXpSqMlMiMaD1LPe9KDtRdBTS3dmtcV/oFoKil4FpRhvgqlSVFCkK7PZxGZrbNpu2gbewMAmu/t973vz9u17M+t5znrAkOQFsoZIshD7PJDMAYkCyV1kuZxjzWTKwZ60OA0rX5w8YdjGEXPNGXezHawhsD7vXIiJ6MCB9TeyziLpLSz5x9baeLsnupd1NsYKO/HUhaxwktfAcrF/ZGJHO+wzw8925kgvAcub9fJ4XRfSdKkiy9kkLhT1XP3cxvC9zRPS9PFlmONp4XpbICTsJmaL4ZWJ3cA6ZrNCrwnBaDbTUdPgRSI2g7SbmKSj9qPW80JYay0EPSwkdELQRUTd0EL3jLCbtUI3/bJ7j6h7s6Nboqhba6FbNLJbxoduP8JuY6Vuq4tuz64u+eC5LAq7vFboEnTsMo0aZsrBfhsKVnDcrrlfIJ0xvEGaOtA294sslWSlNVuZ7hso+fuyLEfqVVe9EFde7wDpFJC+35gQWQKWdxEW623DNg7jgvLk4Yi7Mt2XrCAjyY32Qkh/mphGZDo15Kd7gYOhuHRdXU0IkH6IStAcDNm9a+EatEiYiKitbSOScJLFuCr0CVjeWliRRYD1HrAU8qynDThJlidBu856+68QWUJSP1cKYEVHXPMPGhawFAw74iCdMU7jjuvsi/+NfDpjV6pA8sh62MrPjQZCQQb+dWzX5ItyHlgfI8nHVJ5FXFaxSsVJFoD1fo71ULLn7T871/iKIbUJgPVzSw0xZf9hvd6MCPunkOV7d7jkQVTVtYPUI1P3X8h6E0ivd0lELWq7VXXTtJPFJ0eB9OvqQ0G+ZEtBv7edDUiPR1/0tH+G5tfzAY63FYYjD3cB+VeB9JUNKSD5BiwvkXXYznWD9A/swZn5GuotCQAAAABJRU5ErkJggg=='
const ILecturer = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADb0lEQVR4nO2aXYhMYRjHX0QolxL5SnHhK9rStmaedwiXhFYu1o2yFHbP84zhQpkidhEuJLkiLmTMPM/ZvUHtXlqxiRuKXKklwuYjm3ZZvWfGsvNhZ8+ec+aM/Ou5mXnPe57f/J/3s1HKY9Ul7FlAfE6TvNUkg04gfwDky6ub2ueqalA0bsMwgLwAlNeauFXHZUctpqaoMCpipRdokvelIAoC5fmaeHqeCps0cXvZEL9hHqhkcrwKi3Q8s1QT/xg1CMlg1OINKiwClENuILLBrSosAuK0WxBAvq3CIkDucO+IdKmwCEhuuXaE5J4Ki4Dk1BhK66YKiwD5rHtHOK3+icFO/EiFRYB8egyl1aHCIt0sK9wuiEByUIVJmiTlAuRpXcKepsKkWkxN0chPyoZA+QaJ9MK/9bk4mZqkkU9qklcauQdQWsxnvsNEKbN3FG5cGak/bbb8haV4wneQmsZLE4Hk8chu8KcoyZwRQZB7TPsoSV3MSq/OPdujghAQ7ywDJFFOXzoH4kDEJZZ7/pVvyUfi9mJAPqJROjXJ1zJmqnea5EYUZXdkf2p6qX4BpaXIdP0FKLPes+Tr61MTwOJtQNztdg3JJdYPJLYmjuS/wwxsB8YMdJJ3f7zra4R40Zgh1lhtS8zpbiwAJUquTR/MzC754mRyvHEy5+p1Vc3SzTLfLL5A8jlUx2Q30ihvnNnMyswsvuh4XSp+B/JLIDlmpv2ii061BaC0qKp0ggpAXqswJOJFqP8Km2IWb6r6MUL2RgdGk9ypdDKuA6VzyBVAWQYkA8Ub8icdt3HY4hOQ1ja1zQDMNGnij8WdkAGT+7CHgORiQUPk/mKbuaAVRV5lTpRFQC4WNDbbaSDuzWt4zXxnNnKa5L5G+R5c2bC5zHj46zisiS8Mz417Sx4BgJjyymqX0wnKmUqNAUC+6uQW5y15IFTSQmffRdI19IDFe7KAcr6CIDedHNDe/McPfNfVJYRG3ldBkKOjTrgkiGWvqxSIxsx270Cyg70iIJEDbcs9A1FqcFypudzXsiIZ0MnLkz0EcWa07uDLSp55CpEFkWuBO4IsPoDw4eAd4eOeg8RQtlYApMFzEOcuK+jSInul5yDZWz+ziQzKDfle09g+Vfkh80eYwNxAeeELhOs/zrgObvcPBLkBUPoCcKNvtAP9J5wfEoWV0t2AAAAAAElFTkSuQmCC"

const cardsData = [
  { name: 'Matakuliah', amount: 10, icon: IStudy },
  { name: 'Kelas', amount: 30, icon: IBook },
  { name: 'Dosen', amount: 20, icon: ILecturer },
  { name: 'Ruangan', amount: 30, icon: Iclass },
]

const Card = ({ name, amount, icon }) => (
  <div className="card">
    
    <img src={icon} alt={`${name} icon`} className='card-icon'/>
    <h3>{name}</h3>
    <p>{amount}</p>
  </div>
)

const DashAdmin = () => (
  <div>
    <Sidebar />
    <div className='dashboard'>
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <div className="cards-container-db">
          {cardsData.map((card, index) => (
            <Card key={index} name={card.name} amount={card.amount} icon={card.icon}/>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashAdmin;
