import { Password } from '@oceanbase/ui';
import type { PasswordProps } from '@oceanbase/ui/es/Password';
import React from 'react';
import { formatMessage } from 'umi';

const OCPPassword: React.FC<PasswordProps> = (props) => {
  // 新增部分特殊字符集
  //  https://aone.alipay.com/v2/project/742021/bug/100491551
  // 特殊字符支持：~!@#%^&*_-+=|(){}[]:;,.?/`$'"<>\
  const ocpPasswordRules = [
    {
      validate: (val?: string) => val?.length >= 8 && val?.length <= 32,
      message: formatMessage({
        id: 'oda-web.src.component.Password.TheDescriptionMustBeTo',
        defaultMessage: '长度为 8~32 个字符',
      }),
    },

    {
      validate: (val?: string) =>
        /^[0-9a-zA-Z~!@#%^&*_\-+=|(){}\[\]:;,.?/`$'"<>\\]+$/.test(val),
      message: formatMessage({
        id: 'oda-web.src.component.Password.ItCanOnlyContainLetters',
        defaultMessage:
          '只能包含字母、数字和特殊字符（~!@#%^&*_-+=|(){}[]:;,.?/`$"<>）',
      }),
    },

    {
      validate: (val?: string) =>
        /^(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*\d){2,})(?=(.*[~!@#%^&*_\-+=|(){}\[\]:;,.?/`$'"<>\\]){2,})[A-Za-z\d~!@#%^&*_\-+=|(){}\[\]:;,.?/`$'"<>\\]{2,}$/.test(
          val,
        ),

      message: formatMessage({
        id: 'oda-web.src.component.Password.ItMustContainAtLeast',
        defaultMessage: '大小写字母、数字和特殊字符都至少包含 2 个',
      }),
    },
  ];

  return <Password rules={ocpPasswordRules} {...props} />;
};

export default OCPPassword;
