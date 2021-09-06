import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import styled from '@emotion/styled';
import Login from 'components/login/Login';
import CreateMyGroup from 'components/myGroup/createAndModifyMyGroup/CreateMyGroup';
import ModifyMyGroup from 'components/myGroup/createAndModifyMyGroup/ModifyMyGroup';
import Search from 'components/nav/Search';
import SubMenu from 'components/nav/SubMenu';
import Alert from 'library/components/alert/Alert';
import Button from 'library/components/button/Button';
import ProfileIcon from 'library/components/profileIcon/ProfileIcon';
import { LoginUser } from 'library/models';
import { currentUser } from 'library/store/saveUser';

type Props = {
  isBlurred: boolean;
  setBlurred: React.Dispatch<React.SetStateAction<boolean>>;
};

function Nav({ isBlurred, setBlurred }: Props): JSX.Element {
  const user = useSelector(currentUser);
  const router = useRouter();
  const [isdropDownOpen, setDropDownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [isModalOn, setModalOn] = useState(false);
  const [isActiveAlert, setActiveAlert] = useState(false);
  const [isCreateMyGroupModalOn, setCreateMyGroupModalOn] = useState(false);
  const [isModifyMyGroup, setModifyMyGroup] = useState(false);
  const [isSearchActive, setSearchActive] = useState(false);

  const handleSelectedFunctions = (selected: string): void => {
    setDropDownOpen(false);
    if (selected === '로그아웃') {
      setActiveAlert(true);
    }
  };

  useEffect(() => {
    handleSelectedFunctions(selectedMenu);
  }, [selectedMenu]);

  const handleMouseOverNav = (idx: string): void => {
    if (idx === 'enter') {
      return setBlurred(false);
    }
    setBlurred(true);
    setDropDownOpen(false);
  };

  return (
    <>
      {isActiveAlert && (
        <Alert
          setActiveAlert={setActiveAlert}
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
          alertMessage="로그아웃 하시겠습니까?"
          onSubmit={() => {
            sessionStorage.removeItem('USER');
            window.location.replace('/');
          }}
        />
      )}
      <NavBox
        isBlurred={isBlurred}
        onMouseEnter={() => handleMouseOverNav('enter')}
        onMouseLeave={() => handleMouseOverNav('leave')}
      >
        {isModalOn && <Login setModalOn={setModalOn} />}
        {isCreateMyGroupModalOn && (
          <CreateMyGroup setCreateMyGroupModalOn={setCreateMyGroupModalOn} />
        )}
        {isModifyMyGroup && (
          <ModifyMyGroup getMyGroupTitle={''} setModifyMyGroup={setModifyMyGroup} />
        )}
        <LogoWrap>
          <Link href="/" passHref>
            <Logo onClick={() => setSelectedMenu('')}>
              <img className="logoImage" alt="logo" src="/images/logo.png" />
              <div className="logoText">&gt;wechicken</div>
            </Logo>
          </Link>
        </LogoWrap>
        <UserWrap>
          {router.pathname !== '/search' && (
            <Search
              setSearchActive={setSearchActive}
              isSearchActive={isSearchActive}
              isBlurred={isBlurred}
            />
          )}
          {user.token ? (
            <>
              {(user as LoginUser).master && (
                <img className="masterCrown" alt="master" src="/images/crown.png" />
              )}
              <div onMouseOver={() => setDropDownOpen(true)}>
                <ProfileIcon size={50} img={user.profile} />
              </div>
            </>
          ) : (
            <Button value="로그인" handleFunction={() => setModalOn(true)} isSearchActive={isSearchActive} />
          )}
        </UserWrap>
        {isdropDownOpen && (
          <SubMenu
            setDropDownOpen={setDropDownOpen}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            setCreateMyGroupModalOn={setCreateMyGroupModalOn}
          />
        )}
      </NavBox>
    </>
  );
}

export default Nav;

const NavBox = styled.div<{ isBlurred: boolean }>`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.875rem;
  height: 6.9375rem;
  transition: 700ms;
  background-color: ${({ theme, isBlurred }) => (isBlurred ? '#ffffff1d' : theme.white)};
  backdrop-filter: ${({ isBlurred }) => (isBlurred ? 'blur(5px)' : 'none')};
  z-index: 9;

  ::after {
    background: linear-gradient(transparent, gray);
  }
`;

const LogoWrap = styled.div`
  width: 422px;
  height: 52px;
  display: flex;
  align-items: center;

  .settingMyGroup {
    margin-left: 15px;
    color: ${({ theme }) => theme.deepGrey};
    cursor: pointer;
    opacity: 0.7;
  }
  .settingMyGroup:hover {
    opacity: 1;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  width: 11.875rem;
  text-decoration: none;
  color: ${({ theme }) => theme.fontColor};

  .logoImage {
    width: 3.1875rem;
    height: 3.25rem;
    margin-right: 10px;
    border-radius: 50px;
  }

  .logoText {
    width: 8.125rem;
    font-family: ${({ theme }) => theme.fontTitle};
    font-weight: 500;
    font-size: 1.25rem;
    line-height: 1.6875rem;

    ${({ theme }) => theme.sm`
      font-size: 15px;
    `}
  }
`;

const UserWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 47px;
  position: relative;

  .masterCrown {
    width: 25px;
    height: 25px;
    position: absolute;
    top: -20px;
    right: 12px;
  }
`;
