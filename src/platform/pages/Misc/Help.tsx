import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import parse from 'html-react-parser';
import HomePage from 'platform/pages/Home/HomePage';
import { getHighlightColor } from 'platform/style/MuiStyles';
import { StyledText } from 'platform/style/StyledMui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeScreenText } from 'shared/screenTexts';
import { IStore } from 'shared/store';
import { isMobile } from 'shared/util';
import initContent from './initContent.json';
import './misc.scss';

const Help = () => {
	const {
		helpContent,
		theme: { backgroundColor, mainTextColor }
	} = useSelector((store: IStore) => store);
	const { sections = [] } = helpContent || initContent.helpContent;
	const [showContent, setShowContent] = useState(-1);
	const platform = isMobile() ? 'app' : 'website';

	function toggleShow(index: number) {
		setShowContent(index === showContent ? -1 : index);
	}

	const markup = () => (
		<div className="content">
			{sections.map((section, index1) => {
				const activeColor = showContent === index1 ? getHighlightColor(backgroundColor) : mainTextColor;
				return (
					<Accordion key={index1} expanded={index1 === showContent} onChange={() => toggleShow(index1)}>
						<AccordionSummary expandIcon={<ChevronRightIcon />} style={{ height: 40 }}>
							<StyledText
								text={section.title.replaceAll('{platform}', platform)}
								color={activeColor}
								variant="body1"
							/>
						</AccordionSummary>
						<AccordionDetails
							style={{
								maxHeight:
									'calc(100vh - 284px - 30px - env(safe-area-inset-top) - env(safe-area-inset-bottom))', // 90px for approx safe area inset top/bottom
								overflow: 'scroll',
								borderColor: activeColor
							}}
						>
							<ul>
								{section.points.map((point, index2) => (
									<li key={`section-${index1}-${index2}`}>
										{parse(point.replaceAll('{platform}', platform))}
									</li>
								))}
							</ul>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);

	return <HomePage markup={markup} title={HomeScreenText.HELP} misc={2} skipVerification />;
};

export default Help;
