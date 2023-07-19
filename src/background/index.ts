import { EventName } from '@/common/event-name'
import { getSetting } from '@/common/store/settings'
import type { MessagePayload } from '@/common/types'
// import browser from 'webextension-polyfill'
import { v4 as uuidv4 } from '../../node_modules/uuid/dist/esm-browser/index'

browser.runtime.onMessage.addListener(
  (message: MessagePayload<EventName.openOptionsPage>) => {
    if (message.type === 'open-options-page') {
      browser.runtime.openOptionsPage()
    }
  }
)

browser.runtime.onMessage.addListener(
  (message: MessagePayload<EventName.getToken>, sender, sendResponse) => {
    if (message.type === EventName.getToken) {
      getToken().then((v) => (sendResponse as any)(v))
      return true
    }
  }
)

browser.runtime.onMessage.addListener(
  (message: MessagePayload<EventName.chat>, _, sendResponse) => {
    if (message.type === EventName.chat) {
      fetch('https://chat.openai.com/backend-api/conversation', {
        method: 'POST',
        body: JSON.stringify({
          action: 'next',
          messages: {
            action: 'next',
            messages: [
              {
                id: uuidv4(),
                author: { role: 'user' },
                content: { content_type: 'text', parts: ['prompt'] },
                metadata: {},
              },
            ],
            parent_message_id: uuidv4(),
            model: 'text-davinci-002-render-sha',
          },
        }),
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJhbmNoYW85NTEyMjBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsidXNlcl9pZCI6InVzZXItZG1CSVIxZmNKeDlwdXNqcUowbnd0a250In0sImlzcyI6Imh0dHBzOi8vYXV0aDAub3BlbmFpLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNDIzODIwODM0NzUwMzUwNjcxNiIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2ODYyNzkyNzQsImV4cCI6MTY4NzQ4ODg3NCwiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvcmdhbml6YXRpb24ud3JpdGUifQ.T3a0h_-Xe08w9nc__AKVw2xbg9MHXloYVGmWB06FTvVkRIHXIwSxXJw_ZfyZqU_F3LSYMG8YiN4gHaXvOT0tS0WMxgS_OGEh0_pl3GAUYAdV98GJctnbGoYPXdyy4rD_DLpDDcvgHErvguHXICXGurpF-mM8MPwiMbJSGOt8QbmGAQ_0ILl2Msz6fX1yGXRZC4mrRBCluWVlx3RXOOgqSD9NJh0wQRKq_VVAxoAYaidcD3TsriMxDSokxEg-lCMNrCyNh9efSLZf3FUaYbGmYfR9kSemTOqNT6XJwWWfdvyhWgEZJ4TfQ0_gWGJ_vqHdx5iXOPiPspNBfL81n2xH7w',
          Cookie:
            '_ga=GA1.1.556654635.1681808779; intercom-device-id-dgkjq2bp=9c45a83e-18a4-4702-b5a8-2203d361ad66; cf_clearance=xNY3BpTMCKwRYgj8d8A4xO5yK9kbazchNTGUsf6G6NU-1682172462-0-1-10aa0fbb.3be4d628.47ab505b-160; intercom-id-dgkjq2bp=2683af41-1ba7-4a8b-9f89-39c8188e7280; _ga_9YTZJE58M9=GS1.1.1684550495.4.0.1684550495.0.0.0; __Host-next-auth.csrf-token=c8ab9587cf99b7608c065eb2306e7de96ee737c954dbae9429d1b87466d3ff65%7C1614d4358d6fe2281a1fa1b7dc1e09be27425385d7569a1c1be67577d37c488b; __Secure-next-auth.callback-url=https%3A%2F%2Fchat.openai.com; _cfuvid=6sXapOBWmKQtfgTwl8Jph0FGqbn5XTd78jsomr3zXwQ-1687092916799-0-604800000; __cf_bm=W57tWnbY8L6ZpmzXWovTRDX26VsuZAlroYuTtwysPwU-1687095927-0-AeaYmvUjnhuPvSp50NFqMZMZt96t2phXc+CBIEHU1UHhTneO5oPDbk/gaCQcUw1h2Y5e/j9KH1KVHdrMTWhJMzMQi13tY7d9eguB5DThNLhH; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..nHUBYs09rJKQ9ZrK.wSt7oiNu4BTX5LGxa2nNKR-aZmtn_yQQmZMEJNTetPiKQ3H5eTBx1ZIWN-cQMBQyspzv-j-mBB2F_X0a6zGW27yMtda1hu_Ugxhfmq76-f-lkRWqiIfjCoY3FY0kRb55yZSaztTYGMpIxtJx3eK7zRPJfpipwnYlIqrrmcjHMemvAkYw2-uAA0xbkJaganNtvoqENgzDWCcvkSo9vD3yzXqM4WL3JNEI7EB9a76MktjxxSBeiuUaiKzXh77_5W-m4LYJLgp7B2zu5o78l6JvkLELOKyw13DVOdcOf-2Cfuxs34yNZhCKd4ghkTjvczJ0EaJijrSta3Dv7wG38L9LagW3_nxiZBZrPbzFR6J3MnT8k774LKamZci31NtI8m8A3qLlt3dCDkXr2Qjz09WEkLYzoJ33sBituKo4ifSk3BceIv-Kqmktar9bhOoIC7RFbkl7QE9jpQxr16SdshjsunqnddYSOiU4_gE407nPc9t_K4HTSHpgxh9KHiF0e5p2wd1HouaX2Ti-H_4rbbAiQTza7Sq-GATwnDnAuz1pojb-CEJANKCDxSRp95Lm-Yu8_Z9-PpceGiCBNcbqkNzpQyb8VVinvJC9lUg-uqjSN2oWVu396GO08-BEu0HmruMEIQJo-CkFNJK0ZvzGlzY7WPSbcNEWKpQy9GNepf2cCK7Q6h6c1IX_s_xoxVWcPweoUqdSmoXIkN4lV-7pAqH5Q25CanvrEgq_FdGchi0JpcDfniqVGxYgoyuCdkbf8FABLXyK7h4P9DAC6IU11R3lKBptQ4xUkHnwV7KcXGfI9WQqk_GLnwpis9zUYJMPvQENqDGqry8zxfXiWt4PU72Zn2QqSRk54xkHmVkw_k-eLm8WVofAXZoP9nZO32LTOmMH6ZvpnWDOHG2Osotdl0xBiJoXRYWghUKcP5GD_VYTkKeHDZYZjFBYe2-InBs3UIKQJv9AOXiS_GcZRwe5_kG-aZy3kGF9QtJ0h_ajXehdAV0EeTEIBzfBbCYG1_PFGeSEtsdf5naIbPrU1X8Jrbi2w2EM_XnzMjkjQ2vVr3Sg_Hzlr_D_zMr8k30CP8N07ETgTANV5xh984_94G85PmRTTVnQ6Jnyrp6-V43tUiZkGFgQQDodIaOzSeyOpfA7Uj9-o11oQgbJwaTCulBRr3FUMMDALu1NUzMgYgfoPb5FJSIKAvI_C8OWTBLDucqsoRQMM_mAYKw2ZhW-8lbvs_ti6b3t0Us0yudTuDqU32Em8gIwRloYeawB8DOch2wCbz3BPZpy4zbrgEqr780O47VeSBxq25ExTboGYGGBXh8m7cYV5NkdtOb50rt2E5JuaucM-4G6O_mQGcuALbzDcIRe1_7HHv5R3qsDlzamY8U8xwjskIDt45BXDl4m-BQXwqvG-0H8NoSpQyjSatrTqpuSKY63XCCQcDwVvq2PaQdbWQU5r8it59QTzJlAQVZxwAk3WYSAZ7GCS58Tb3FapxxK5y901AJ-qLUS2HxNlAtw-EupMNLQSfrixRuPUB7gO4nAESOWf5ii3dj9qriLL7C5LxxIuVLzCWCU6TPSAWSTHmvDk2T-B_aXsw8kP4PEychQbDtnSpgOpJKQb_oozT9egmeNSLSIZx7GuV-2OcVJVaQLMuLcVWiyXAiG3Tsy6gsJdSA1Fwst3V6ymP3U9v9LsAeBLpZkYs5d0GdbHUZyVoTf6bf9jBcjEIxBohelplE7mfy4643TCurZAOXABcBka_D26177jaZhrppus3gak6kWNFwQuYhk-UmiU_LoPkacKsdBMl0aSFEXRoUAg19NE6hbTm1wqkO1GPGrb2iXpEDm-awM04h4M8Fq1LHvKDG6jsl8oLzatAQB9YDln1fwlW-usQFTLhhKSFJx2CdT4Rt2T7HEjOTekMtp68RZ6EZmCv4m3qCumbSTOs1mqBJQRuzrpF0EZcDiaHtRBqTgTrRjL2Vi9SFk4q46X25WwJyf9QbonCYQbLpybmlYoFbzsmI8KD3ei01p0Aopyu1vjr8zuLq61gE2lsvmHOXLbyOimLvk9jTKcI5iY6XaWEaT_dYHKE6nniQSAB3feCFUqmtFcU7JnTkAGg7xCTKD8fbhXU70-M-zLdisset7DbrxTBEE41_fgvJvP9u1LzTeOy-8MKE0FR23jfLyCpxlT0NethIHfffVtE9Zu69dE8FxXQZAVjy_TR_0RdGLqqDQnslamhQiuYXLHy9-P4gm47AfQrfsNAToaMJ7nKJsWzO4lyB5ZGRHEBkPMxlh5G1iLfSriXPESl3O8C8yTI24aUzxKxpqDXlG-l1PJoCSHDNcvWt_EADwKB0fijBpHLnzydVkcZg8bYlzvSZIkQBF8IgcnGzOaNnrHSbxJvYQ-evKqrzhUSS8dUSMuE4tDTg9RuFkr4yVpUjfGgJIVfCQXJh-HEwo-V2J0s5baWc4f_hP1KxCM_p9oaboifa8EojlyU6HA3MzCC0Y5lBwndmkegslJG6JUh_NLK47zY6E0IbD58N91UykBTvvwbBS_g.NuQbW-JN4Dkemb3WyhEr8A; intercom-session-dgkjq2bp=eS9BU1JmRHNyc0ptOU1XcVFDYk41djJYeDNUck9xYXozOHRacDJJYVFRNktpNkZxU2dPQURwN1NXNmZCc3hiUy0tY3hJZHFmTjdabTljOC82bW9ZY2ZTdz09--ace1bf1e30552219b64bb29010d4ac14d6759cde; _dd_s=rum=0&expire=1687097165195',
        },
      })
        .then((res) => res.json())
        .then(sendResponse)

      return true
    }
  }
)

browser.contextMenus.create({
  title: 'Launch writely',
  id: 'writely',
  contexts: ['selection'],
})

browser.contextMenus.create({
  title: 'Writely instructions',
  id: 'writely-instructions',
  contexts: ['selection'],
})

const createSubMenu = async () => {
  const settings = await getSetting()

  settings.customInstructions?.map((instruction) => {
    browser.contextMenus.create({
      title: instruction.name,
      id: instruction.id,
      contexts: ['selection'],
      parentId: 'writely-instructions',
    })
  })
}

createSubMenu()

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'writely' && tab.id) {
    browser.tabs.sendMessage(tab.id, {
      type: EventName.launchWritely,
    })
  }

  if (info.parentMenuItemId === 'writely-instructions') {
    browser.tabs.sendMessage(tab.id, {
      type: EventName.launchWritelyResultPanel,
      data: {
        instruction: info.menuItemId,
      },
    })
  }
})

const getToken = async () => {
  try {
    return JSON.parse(
      decodeURIComponent(
        (
          await browser.cookies.get({
            name: 'supabase-auth-token',
            url: 'https://writely.miao-ya.com',
          })
        ).value || ''
      )
    )[0]
  } catch {
    return ''
  }
}
