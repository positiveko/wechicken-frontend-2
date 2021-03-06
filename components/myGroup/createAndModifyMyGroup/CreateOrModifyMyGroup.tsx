import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/dist/client/router';
import styled from '@emotion/styled';
import CelebratingModal from 'components/login/CelebratingModal';
import BtnSubmit from 'library/components/button/BtnSubmit';
import InputTheme from 'library/components/input/InputTheme';
import { currentUser, saveUser } from 'library/store/saveUser';
import { postCreateOrModifyGroup } from 'library/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { LoginUser } from 'library/models';

type Props = {
  title: string;
  informationText: string;
  btnText: string;
  closeModal: () => void;
  celebratingMessage: string;
  myGroupTitleText?: string;
};

function CreateOrModifyMyGroup({
  title,
  informationText,
  btnText,
  closeModal,
  celebratingMessage,
  myGroupTitleText,
}: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ myGroupTitle: '', count: '', penalty: '' });
  const [isSubmitActivate, setSubmitActivate] = useState(false);
  const [isCelebratingModalOn, setCelebratingModalOn] = useState(false);

  const user = useSelector(currentUser);

  const { myGroupTitle, count, penalty } = form;

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const setMyGroupPage = async (): Promise<void> => {
    setCelebratingModalOn(true);

    await postCreateOrModifyGroup(
      myGroupTitle,
      count.replace(/[^0-9]/g, ''),
      penalty.replace(/[^0-9]/g, ''),
    );

    setTimeout(closeModal, 2000);
    router.push('/mygroup');
    dispatch(saveUser({ ...user, myGroupStatus: true }));

    sessionStorage.setItem(
      'USER',
      JSON.stringify({
        ...JSON.parse(sessionStorage.getItem('USER') ?? '{}'),
        myGroupStatus: true,
        master: true,
      }),
    );
  };

  useEffect(() => {
    myGroupTitle && count && penalty ? setSubmitActivate(true) : setSubmitActivate(false);
  }, [myGroupTitle, count, penalty]);

  return (
    <>
      {isCelebratingModalOn ? (
        <CelebratingModal celebratingMessage={celebratingMessage} />
      ) : (
        <CreateOrModifyMyGroupBox>
          <Title>
            <img className="logoImage" alt="logo" src="/images/logo.png" />
            <div className="titleTextWrap">
              <span className="logoText">{'>'}wechicken</span>
              <span className="titleText">{title}</span>
            </div>
          </Title>
          <FontAwesomeIcon onClick={closeModal} className="BtnClose" icon={faTimes} />
          <CreateOrModifyMyGroupContents>
            <Description>
              <h1>{informationText}</h1>
              <p>
                wecode ?????????<br></br>
                wechicken??? ?????? ?????? ???????????????!
              </p>

              <p>
                wechicken??? ?????? ????????? ???????????????<br></br>
                ????????? ??? ????????? ????????? ????????????.
              </p>

              <p>
                ????????? ?????? ??? ?????? ????????? ?????? ??????<br></br>
                ????????? ????????? ?????? ??? ????????? ?????????<br></br>
                ???????????????.
              </p>

              <p>
                ??????????????? ???????????? ????????? ?????? ??????<br></br>
                ?????????????????? (????????)??? ?????????!
              </p>
            </Description>
            <InputFormWrap>
              <span className="nth">{user?.nth}???</span>
              <InputTheme
                width="10.625rem"
                style={{ minWidth: '180px' }}
                type="?????? ????????????"
                name="myGroupTitle"
                handleEvent={handleChangeInput}
                placeholder={myGroupTitleText ?? (user as LoginUser).myGroupTitle}
                size="14px"
              />
              <InputTheme
                width="10.625rem"
                style={{ minWidth: '180px' }}
                type="??? ????????? ????????? ??????"
                name="count"
                handleEvent={handleChangeInput}
                placeholder="??????) ??? 3???"
                size="14px"
              />
              <InputTheme
                width="10.625rem"
                style={{ minWidth: '180px' }}
                type="?????? ?????????"
                name="penalty"
                handleEvent={handleChangeInput}
                placeholder="??????)3000???"
                size="14px"
              />
            </InputFormWrap>
          </CreateOrModifyMyGroupContents>
          <BtnSubmit
            btnText={btnText}
            executeFunction={setMyGroupPage}
            isSubmitActivate={isSubmitActivate}
          />
        </CreateOrModifyMyGroupBox>
      )}
    </>
  );
}

export default CreateOrModifyMyGroup;

const CreateOrModifyMyGroupBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  align-items: center;

  .logoImage {
    width: 60px;
    height: 60px;
    margin: 1.875rem;
  }

  .titleTextWrap {
    display: flex;
    flex-direction: column;

    .logoText {
      font-size: 16px;
      font-family: ${({ theme }) => theme.fontTitle};
    }

    .titleText {
      margin-top: 7px;
      font-size: 16px;
      font-weight: 600;
      font-family: ${({ theme }) => theme.fontContent};
      color: ${({ theme }) => theme.orange};
    }
  }
`;

const Description = styled.div`
  width: 14.375rem;
  font-family: ${({ theme }) => theme.fontContent};
  color: ${({ theme }) => theme.deepGrey};

  ${({ theme }) => theme.sm`
    width:100%;
  `}

  h1 {
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 15px;
    color: ${({ theme }) => theme.fontColor};
  }

  p {
    margin-bottom: 15px;
    line-height: 18px;
    font-size: 12px;
  }
`;

const CreateOrModifyMyGroupContents = styled.div`
  margin: 10px 5.9375rem;
  display: flex;
  justify-content: space-between;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  ${({theme})=> theme.md`
    margin: 0 25px;
  `}

  ${({ theme }) => theme.sm`
    flex-direction: column;
    margin: 15px;
  `}
`;

const InputFormWrap = styled.form`
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  span.nth {
    font-size: 14px;
    margin-left: 12px;
    color: ${({ theme }) => theme.fontColor};

    ${({ theme }) => theme.md`
      margin-bottom: 12px;
    `}
  }
`;
