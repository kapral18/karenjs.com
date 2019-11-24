import React, { FC } from "react";
import { Location } from "@reach/router";
import {
    TwitterShareButton,
    TwitterIcon,
    EmailShareButton,
    EmailIcon,
    RedditShareButton,
    RedditIcon,
    TelegramShareButton,
    TelegramIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappShareButton,
    WhatsappIcon
} from "react-share";
import styled from "styled-components";

const IconWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 200px;

    .SocialMediaShareButton {
        cursor: pointer;
    }
`;

const Paragraph = styled.p`
    margin-top: 0;
    font-size: 1.4rem;
    color: rgb(0, 0, 0);
`;

interface Props {
    post: {
        title: string;
        excerpt: string;
        author: string;
        tags: string[];
    };
}

const Share: FC<Props> = ({ post }) => {
    return (
        <div>
            <Paragraph>Share if you liked it:</Paragraph>

            <Location>
                {({ location: { href: url } }) => {
                    const callToRead = `Read ${post.title} by ${post.author}`;

                    return (
                        <IconWrapper>
                            <TwitterShareButton
                                url={url}
                                title={callToRead}
                                via="kaafury"
                                hashtags={post.tags}
                            >
                                <TwitterIcon size={28} round />
                            </TwitterShareButton>
                            <RedditShareButton url={url} title={callToRead}>
                                <RedditIcon size={28} round />
                            </RedditShareButton>
                            <LinkedinShareButton url={url}>
                                <LinkedinIcon size={28} round />
                            </LinkedinShareButton>
                            <TelegramShareButton url={url} title={callToRead}>
                                <TelegramIcon size={28} round />
                            </TelegramShareButton>
                            <WhatsappShareButton url={url} title={callToRead}>
                                <WhatsappIcon size={28} round />
                            </WhatsappShareButton>
                            <EmailShareButton
                                url={url}
                                subject={callToRead}
                                body={`${post.excerpt}
                                        Read more at ${url}
                                    `}
                            >
                                <EmailIcon size={28} round />
                            </EmailShareButton>
                        </IconWrapper>
                    );
                }}
            </Location>
        </div>
    );
};

export default Share;
